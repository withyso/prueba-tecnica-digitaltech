import toast from "react-hot-toast"

const options = {
    position: "top-center",
    duration: 2500,
}

export const showNotification = (msg, type = "success") => {
    switch (type) {
        case "success":
            toast.success(msg, options)
            break
        case "error":
            toast.error(msg, options)
            break
        default:
            toast(msg)
            break
    }
}