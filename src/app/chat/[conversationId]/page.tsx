import Body from "@/components/chat/Body";
import ChatForm from "@/components/chat/Form";
import Header from "@/components/chat/Header";
import { getConversationById, getMessages } from "@/lib/actions";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation!} />
        <Body initialMessages={messages} />
        <ChatForm />
      </div>
    </div>
  );
};

export default ConversationId;
