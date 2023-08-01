import fs from "node:fs";
import { Buffer } from "node:buffer";

function saveConcatenatedFilesContent(filesContent, dest, cb) {
    fs.writeFile(dest, filesContent, (err) => {
        if (err) {
            return cb(err);
        }

        cb(null, dest, filesContent);
    });
}

function concatFilesIntoBuffer(srcFiles, cb) {
    let filesContent = new Map(srcFiles.map((srcFile) => [srcFile, undefined]));
    let filesReaded = 0;

    for (const srcFile of srcFiles) {
        fs.readFile(srcFile, (err, data) => {
            if (err) {
                return cb(err);
            }

            filesContent.set(srcFile, data);
            filesReaded++;

            if (filesReaded === srcFiles.length) {
                return cb(
                    null,
                    Array.from(filesContent.values()).reduce((prev, curr) =>
                        Buffer.concat([prev, curr])
                    )
                );
            }
        });
    }
}

export function concatFiles(srcFiles, dest, cb) {
    concatFilesIntoBuffer(srcFiles, (err, filesContent) => {
        if (err) {
            return cb(err);
        }

        saveConcatenatedFilesContent(filesContent, dest, cb);
    });
}
