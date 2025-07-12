'use client'

import GenericPlaceholder from "@/components/blocks/generic-placeholder"

export default function Inbox() {
    return <div className="h-[95vh] flex justify-center items-center">
        <GenericPlaceholder heading={"You have no messages"} paragraph={"Your inbox is empty. Send a message to a friend to get started."} image={'/Inbox.png'} />
    </div>
}