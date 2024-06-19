import { revalidatePath } from "next/cache";
import { db } from "./db";
import { UpdateUser } from "./validators/user";
import { z } from "zod";
import { getUserId } from "./utils";

export async function updateProfile(values: z.infer<typeof UpdateUser>) {
  const userId = await getUserId();

  const validatedFields = UpdateUser.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Profile.",
    };
  }

  const { bio, image, name, username } = validatedFields.data;

  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        image,
        bio,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Updated Profile." };
  } catch (error) {
    return { message: "Database Error: Failed to Update Profile." };
  }
}
