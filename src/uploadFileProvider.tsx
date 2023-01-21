import { dataProvider } from './dataProvider';

const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });

export const uploadFileProvider = {
    ...dataProvider,
    create: (resource, params) => {
        if (resource != "createDbScript" && resource != "schemaupdatescript") {
            return dataProvider.update(resource, params);
        }

        if (resource === "schemaupdatescript") {
            const newScripts: File[] = [];
            if (params.data.updateScriptAttachments.rawFile instanceof File) {
                newScripts.push(params.data.updateScriptAttachments);
            }
            if (params.data.rollBackScriptAttachments.rawFile instanceof File) {
                newScripts.push(params.data.rollBackScriptAttachments);
            }

            return Promise.all(newScripts.map(convertFileToBase64))
                .then(base64Flies =>
                    base64Flies.map(file64 => ({
                        src: file64,
                    }))
                )
                .then(transformedNewScripts =>
                    dataProvider.create(resource, {
                        data: {
                            ...params.data,
                            updateScriptAttachments: [
                                transformedNewScripts[0],
                            ],

                            rollBackScriptAttachments:(
                                transformedNewScripts.length>1?[transformedNewScripts[1]]:[]
                            )
                        },
                    })
                );
        }
        else {

            const newScripts: File[] = [];
            if (params.data.attachments.rawFile instanceof File) {
                newScripts.push(params.data.attachments);
            }

            return Promise.all(newScripts.map(convertFileToBase64))
                .then(base64Flies =>
                    base64Flies.map(file64 => ({
                        src: file64,
                    }))
                )
                .then(transformedNewScripts =>
                    dataProvider.create(resource, {
                        data: {
                            ...params.data,
                            attachments: [
                                ...transformedNewScripts,
                            ],
                        },
                    })
                );
        }
    }
}