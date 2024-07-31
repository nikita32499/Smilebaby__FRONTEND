export const getImageBlob = async (file: File) => {
    const imageBuffer = await new Promise<ArrayBuffer | string>((resolve, reject) => {
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

export const isImage = (key: unknown): boolean => {
    return typeof key === 'string' && key.match(/^image/) !== null;
};
