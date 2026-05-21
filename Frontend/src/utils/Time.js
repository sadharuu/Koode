export const Time=(date)=>
    new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });