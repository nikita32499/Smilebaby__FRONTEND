class _FileService_ {
    getImageBlob = async (file: File) => {
        let imageBuffer = await new Promise<ArrayBuffer | string>((resolve, reject) => {
            try {
                const reader = new FileReader();

                reader.onload = function (e) {
                    if (!e.target?.result) return reject(e);
                    resolve(e.target.result);
                };

                reader.readAsArrayBuffer(file);
            } catch (error) {
                reject(error);
            }
        });
        const blob = new Blob([imageBuffer], { type: 'image/*' });

        const imageBlob = URL.createObjectURL(blob);

        return imageBlob;
    };

    isImage(key: unknown): key is string {
        return typeof key === 'string' && key.match(/^image/) !== null;
    }
}

const FileService = new _FileService_();

export { FileService };
