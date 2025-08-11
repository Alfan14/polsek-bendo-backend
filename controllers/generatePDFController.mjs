import express from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isValidHttpUrl(str) {
    try {
        const u = new URL(str);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
}

export async function getBase64Image(filePathOrUrl) {
    try {
        if (isValidHttpUrl(filePathOrUrl)) {
            const { data } = await axios.get(filePathOrUrl, { responseType: 'arraybuffer' });
            return Buffer.from(data).toString('base64');
        }

        const buf = await fs.readFile(
            path.isAbsolute(filePathOrUrl) ? filePathOrUrl : path.join(__dirname, filePathOrUrl)
        );
        return buf.toString('base64');

    } catch (err) {
        console.error(`Error getting image from ${filePathOrUrl}: ${err.message}`);
        return 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
}

const generateSkckPdf = async (skck, skckOfficer) => {
    const polriEmblemBase64 = await getBase64Image('public/Lambang_Polri.png');
    const applicantPhotoBase64 = await getBase64Image(skck.passport_photo);

     const submissionDate = new Date(skck.submission_date);

    const expirationDate = new Date(submissionDate);
    
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const formattedSubmissionDate = submissionDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const formattedExpirationDate = expirationDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-software-rasterizer",
        ],
    });

    const page = await browser.newPage();

    await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SKCK Document</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    margin: 0;
                    padding: 20px;
                    font-size: 12pt;
                }
                .skck-container {
                    width: 8.5in;
                    min-height: 11in;
                    margin: auto;
                    padding: 0.5in;
                    box-sizing: border-box;
                    position: relative;
                }
                .polri-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80%;
                    height: auto;
                    opacity: 0.1;
                    z-index: 0;
                    pointer-events: none;
                }
                .relative { position: relative; }
                .z-10 { z-index: 10; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-sm { font-size: 0.875rem; }
                .text-md { font-size: 1rem; }
                .text-lg { font-size: 1.125rem; }
                .text-xl { font-size: 1.25rem; }
                .text-xs { font-size: 0.75rem; }
                .font-bold { font-weight: bold; }
                .uppercase { text-transform: uppercase; }
                .italic { font-style: italic; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-8 { margin-top: 2rem; }
                .ml-6 { margin-left: 1.5rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .items-end { align-items: flex-end; }
                .space-x-2 > *:not(:first-child) { margin-left: 0.5rem; }
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .col-span-full { grid-column: 1 / -1; }
                .gap-y-2 > *:not(:first-child) { margin-top: 0.5rem; }
                .data-label {
                    font-weight: normal;
                    margin-right: 5px;
                    display: inline-block;
                    min-width: 150px;
                }
                .data-value {
                    font-weight: bold;
                }
                .list-lower-alpha {
                    list-style-type: lower-alpha;
                }
                .w-16 { width: 4rem; }
                .h-16 { height: 4rem; }
                .w-24 { width: 6rem; }
                .h-32 { height: 8rem; }
                .w-48 { width: 12rem; }
                .h-20 { height: 5rem; }
                .border { border: 1px solid #e2e8f0; }
                .border-b-2 { border-bottom: 2px solid #cbd5e0; }
                .object-cover { object-fit: cover; }
                .object-top { object-position: top; }
            </style>
        </head>
        <body>
            <div id="skck_document" class="skck-container">
                <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Emblem Watermark" class="polri-watermark">

                <div class="relative z-10">
                    <div class="text-center mb-6">
                        <p class="text-lg font-bold">KEPOLISIAN NEGARA REPUBLIK INDONESIA</p>
                        <p class="text-md">RESOR KABUPATEN MAGETAN</p>
                        <p class="text-md">SEKTOR BENDO</p>
                        <p class="text-sm">Gorang-Gareng Jl. Raya Bendo No.209, Dusun Bendo, Belotan, Kec. Magetan, Kabupaten Magetan, Jawa Timur 63384</p>
                    </div>

                    <div class="flex justify-between items-center mb-6">
                        <div class="flex items-center space-x-2">
                            <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Header Emblem" class="h-16 w-16 mx-auto mb-4">
                            <h1 class="text-xl font-bold uppercase">SURAT KETERANGAN CATATAN KEPOLISIAN</h1>
                        </div>
                        <p class="text-right text-sm">No : 09 - 0986542</p>
                    </div>
                    <p class="text-center text-lg font-bold mb-6">POLICE RECORD</p>
                    <p class="text-center text-sm mb-6">Nomor: SKCK/YANMAS/2.490/VII/2012/Sek.TJ</p>

                    <div class="mb-6 grid grid-cols-2 gap-y-2">
                        <p class="col-span-full mb-2">Diterangkan bersama ini bahwa:</p>
                        <p class="col-span-full mb-4">This is to certify that:</p>

                        <div><span class="data-label">Nama</span></div>
                        <div><span class="data-value">: ${skck.applicant_name}</span></div>

                        <div><span class="data-label">Name</span></div>
                        <div><span class="data-value">: ${skck.applicant_name}</span></div>
                        
                        <div><span class="data-label">Jenis Kelamin</span></div>
                        <div><span class="data-value">: ${skck.sex === "male" ? "Laki-Laki" : "Perempuan"}</span></div>

                        <div><span class="data-label">Sex</span></div>
                        <div><span class="data-value">: ${skck.sex === "male" ? "Men" : "Women"}</span></div>
                        

                        <div><span class="data-label">Kebangsaan</span></div>
                        <div><span class="data-value">: ${skck.nationality}</span></div>

                        <div><span class="data-label">Nationality</span></div>
                        <div><span class="data-value">: ${skck.nationality}</span></div>

                        <div><span class="data-label">Agama</span></div>
                        <div><span class="data-value">: ${skck.religion}</span></div>

                        <div><span class="data-label">Religion</span></div>
                        <div><span class="data-value">: ${skck.religion}</span></div>

                        <div><span class="data-label">Tempat dan tgl. lahir</span></div>
                        <div><span class="data-value">: ${skck.place_date_birth}</span></div>

                        <div><span class="data-label">Place and date of birth</span></div>
                        <div><span class="data-value">: ${skck.place_date_birth}</span></div>

                        <div><span class="data-label">Tempat tinggal sekarang</span></div>
                        <div><span class="data-value">: ${skck.complete_address}</span></div>

                        <div><span class="data-label">Current address</span></div>
                        <div><span class="data-value">: ${skck.complete_address}</span></div>

                        <div><span class="data-label">Pekerjaan</span></div>
                        <div><span class="data-value">: Karyawan</span></div>

                        <div><span class="data-label">Occupation</span></div>
                        <div><span class="data-value">: Employee</span></div>

                        <div><span class="data-label">Nomor Kartu Tanda Penduduk</span></div>
                        <div><span class="data-value">: ${skck.id_number}</span></div>

                        <div><span class="data-label">Identity card number</span></div>
                        <div><span class="data-value">: ${skck.id_number}</span></div>

                        <div><span class="data-label">Nomor Paspor/KITAS/KITAP</span></div>
                        <div><span class="data-value">: -</span></div>

                        <div><span class="data-label">Passport/KITAS/KITAP number</span></div>
                        <div><span class="data-value">: -</span></div>

                        <div><span class="data-label">Rumus sidik jari</span></div>
                        <div><span class="data-value">: 31.114 - III</span></div>

                        <div><span class="data-label">Fingerprints FORMULA</span></div>
                        <div><span class="data-value">: 31.114 - III</span></div>
                    </div >

                    <div class="mb-6">
                        <p>Setelah diadakan penelitian hingga saat dikeluarkan surat keterangan ini yang didasarkan kepada:</p>
                        <p>As of checking through the issuer hereof by virtue of:</p>
                        <ol class="list-lower-alpha ml-6">
                            <li>Catatan Kepolisian yang ada</li>
                            <li>Existing Police record</li>
                            <li>Surat Keterangan dari Kepala Desa / Lurah</li>
                            <li>Information from local Authorities</li>
                        </ol>
                        <p class="mt-4">bahwa nama tersebut diatas tidak memiliki catatan atau keterlibatan dalam kegiatan kriminal apapun.</p>
                        <p>the bearer hereof proves not to be involved in any criminal cases</p>
                        <p class="mt-4">selama ia berada di Indonesia dari <span class="data-value">27 Juli 2025</span></p>
                        <p>during his/her stay in Indonesia from <span class="data-value">27 Juli 2025</span></p>
                        <p>sampai dengan <span class="data-value">${formattedExpirationDate}</span></p>
                        <p>until <span class="data-value">${formattedExpirationDate}</span></p>
                    </div>

                    <div class="mb-6">
                        <p class="text-center italic mb-4">Keterangan ini diberikan berhubung dengan permohonan</p>
                        <p class="text-center italic mb-4">This certificate is issued at the request to the applicant</p>

                        <div class="grid grid-cols-2 gap-y-2">
                            <div><span class="data-label">Untuk keperluan/menuju</span></div>
                            <div><span class="data-value">: Persyaratan Melamar Pekerjaan</span></div>

                            <div><span class="data-label">For the purpose</span></div>
                            <div><span class="data-value">: ${skck.needs}</span></div>

                            <div><span class="data-label">Berlaku dari tanggal</span></div>
                            <div><span class="data-value">: ${formattedSubmissionDate}</span></div>

                            <div><span class="data-label">Valid from</span></div>
                            <div><span class="data-value">: ${formattedSubmissionDate}</span></div>

                            <div><span class="data-label">Sampai dengan</span></div>
                            <div><span class="data-value">:${formattedExpirationDate}</span></div>

                            <div><span class="data-label">To</span></div>
                            <div><span class="data-value">: ${formattedExpirationDate}</span></div>
                        </div>
                    </div>

                    <div class="flex justify-between items-end mt-8">
                        <div>
                            <img src="data:image/jpeg;base64,${applicantPhotoBase64}" alt="Applicant Photo" class="w-24 h-32 border border-gray-300 object-cover object-top">
                        </div>
                        <div class="text-center">
                            <p>Dikeluarkan di : Bendo</p>
                            <p>Issued in : Bendo</p>
                            <p>Pada tanggal : ${formattedSubmissionDate}</p>
                            <p>On : ${formattedSubmissionDate}</p>
                            <p class="mt-4 font-bold">KEPALA KEPOLISIAN SEKTOR BENDO</p>
                            <div class="h-20 w-48 border-b-2 border-gray-400 mx-auto mt-4"></div>
                            <p class="mt-2 text-sm">${skckOfficer.username}</p>
                            <p class="text-xs">NRP.${skckOfficer.nrp}</p>
                        </div>
                    </div>
                </div >
            </div >
        </body >
        </html >
    `);

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    return pdfBuffer;
};


export default { generateSkckPdf };