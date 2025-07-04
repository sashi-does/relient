import Image from "next/image";

export default function InboxPlaceholder() {
  return (
    <div className="p-5 w-[400px] flex flex-col gap-y-3">
      <Image
        draggable={false}
        className="ml-[-15px]"
        src={"/inbox.png"}
        width={130}
        height={130}
        alt="portal"
      />
      <h1>You have no messages</h1>
      <p className="text-[#5B5B5D] text-[14px]">
        Your inbox is empty. Send a message to a friend to get started.
      </p>
    </div>
  );
}
