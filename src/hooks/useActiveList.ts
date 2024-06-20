import { useQueryClient } from "@tanstack/react-query";

export default function useActiveList() {
  const queryClient = useQueryClient();

  const members: string[] = queryClient.getQueryData(["members"]) || [];

  // const add = (id) => {
  //   queryClient.setQueryData('members', (old) => [...old, id]);
  // };

  // const remove = (id) => {
  //   queryClient.setQueryData('members', (old) => old.filter((mId) => mId !== id));
  // };

  const set = (ids: string[]) => {
    queryClient.setQueryData(["members"], ids);
  };

  return {
    members,
    // add,
    // remove,
    set,
  };
}
