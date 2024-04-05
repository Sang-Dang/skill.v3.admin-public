export async function fileToBinary(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(new Blob([new Uint8Array(reader.result as ArrayBuffer)]))
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
}
