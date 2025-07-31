export type ListenerEntry = {
    target: "window" | "document" | HTMLElement;
    event: string;
    callback: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
};
