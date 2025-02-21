export function formatMessageTime(data) {
    return new Date(data).toLocaleTimeString("en-IN",{
        hour: "2-digit",
        minute: "2-digit",
    })
}