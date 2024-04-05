import { TicketModel } from '@/lib/model/ticket.model'

export const fileQueryKeys = {
    GetImageByPath: (path?: string) => ['file', 'image', path],
    GetImagesByPath: (path?: string[]) => ['file', 'images', path],
    GetImagesFromTicket: (ticket?: TicketModel) => ['file', 'images', ticket?.images],
}
