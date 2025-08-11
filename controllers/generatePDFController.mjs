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
                        <p class="mt-4">selama ia berada di Indonesia dari <span class="data-value">${formattedSubmissionDate}</span></p>
                        <p>during his/her stay in Indonesia from <span class="data-value">${formattedSubmissionDate}</span></p>
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


const generateSikPdf = async (sik, sikOfficer) => {
    const polriEmblemBase64 = await getBase64Image('public/Lambang_Polri.png');
    const applicantPhotoBase64 = await getBase64Image(sik.passport_photo);

    const submissionDate = new Date(sik.form_creation);

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
            <title>Surat Izin Keramaian</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #f0f0f0; /* Light grey background for the page itself */
                }
                .surat-container {
                    max-width: 800px;
                    margin: 2rem auto;
                    background-color: #FCF8E8; /* A light, warm off-white, similar to original document */
                    padding: 2.5rem; /* Slightly more padding for formal document */
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow: hidden;

                    /* Subtle fine line pattern in background */
                    background-image:
                        repeating-linear-gradient(0deg, #E0DBCF 0.5px, transparent 0.5px, transparent 8px),
                        repeating-linear-gradient(90deg, #E0DBCF 0.5px, transparent 0.5px, transparent 8px);
                    background-size: 8px 8px; /* Control density of the lines */
                    background-repeat: repeat;
                    background-blend-mode: multiply;
                    background-position: center center;
                    /* opacity: 0.98; */ /* Adjust if the pattern is too strong */
                }

                .polri-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0.08; /* Very faded effect for watermark */
                    width: 70%; /* Adjust size */
                    height: auto;
                    z-index: 0;
                    pointer-events: none;
                    filter: grayscale(100%); /* Make watermark grayscale for more formal look */
                }

                /* Ensure content is always on top */
                .relative.z-10 {
                    position: relative;
                    z-index: 10;
                }

                .section-title {
                    font-weight: bold;
                    text-decoration: underline;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                }

                .list-decimal-custom {
                    list-style-type: decimal;
                    padding-left: 1.5rem; /* Indent for list numbers */
                }
                .list-decimal-custom li {
                    margin-bottom: 0.5rem; /* Space between list items */
                }
                .data-value {
                    color: #555;
                }
            </style>
        </head>
        <body>

            <div class="surat-container">
                <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Emblem Watermark" class="polri-watermark">

                <div class="relative z-10">
                    <div class="text-center mb-8">
                        <p class="text-base font-bold">KEPOLISIAN NEGARA REPUBLIK INDONESIA</p>
                        <p class="text-sm">DAERAH BENDO</p>
                        <p class="text-sm">Gorang-Gareng Jl. Raya Bendo No.209, Dusun Bendo, Belotan, Kec. Magetan, Kabupaten Magetan, Jawa Timur 63384</p>
                        <div class="mt-4">
                        <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Emblem Watermark" class="polri-watermark">
                        </div>
                    </div>

                    <div class="flex justify-between items-end mb-4">
                        <div class="flex-grow text-center">
                            <p class="text-xl font-bold uppercase tracking-wider">SURAT - IJIN</p>
                            <p class="text-sm">No.Pol: SI/ YANMIN / 241 / I / 2017 / DATRO</p>
                        </div>
                        <p class="text-right text-sm font-bold ml-auto">ASLI</p>
                    </div>

                    <p class="section-title">Pertimbangan:</p>
                    <ol class="list-decimal-custom text-sm">
                        <li>Bahwa telah dipenuhinya segala hal yang merupakan persyaratan formal dalam penerbitan Surat Izin Kegiatan / keramaian umum.</li>
                        <li>Bahwa kegiatan yang akan dilaksanakan dipandang tidak bertentangan dengan kebijakan Pemerintah Pusat pada umumnya, serta kebijakan Pemerintah Daerah khususnya ditempat kegiatan dilaksanakan.</li>
                        <li>Bahwa kegiatan yang akan dilaksanakan itu dimungkinkan untuk tidak menimbulkan kerawanan kamtibmas, ataupun dalam lingkungan dimana kegiatan dilaksanakan.</li>
                    </ol>

                    <p class="section-title">Dasar:</p>
                    <ol class="list-decimal-custom text-sm">
                        <li>UU RI No. 2 Tahun 2002 tentang Kepolisian Negara RI.</li>
                        <li>Keppres No. 67 Tahun 2001 tanggal 2 Agustus 2001 tentang Perubahan atas Keputusan Presiden RI No. 54 tahun 2001 tentang Organisasi dan Tata Cara Kerja Satuan-satuan Organisasi Kepolisian Negara Republik Indonesia.</li>
                        <li>Kep. KEPALA KEPOLISIAN NEGARA RI DAN MENTERI PERTAHANAN KEAMANAN RI NOMOR KEP/139/XII/1995 dan NOMOR KEP/139/XII/1995 tentang petunjuk Pelaksanaan Perizinan sebagaimana diatur dalam Undang-undang No. 5 Tahun 1995 tentang Keamanan Polri.</li>
                        <li>Kep. Kapolri No. Pol. : JUKLAK/09/IX/1995, tanggal 29 Desember 1995 tentang Perizinan dan pemberitahuan kegiatan masyarakat.</li>
                        <li>Kep. KAPOLRI No. Pol : KEP/54/X/2002 tanggal 17 Oktober 2002 perihal Organisasi dan Tata Cara Kerja Kepolisian Daerah Metro Jaya dan Subdinas.</li>
                        <li>Peraturan Daerah Propinsi Daerah Khusus Ibukota Jakarta Nomor : 10 Tahun 2004 tentang Keramaian Umum.</li>
                        <li>Keputusan Gubernur Propinsi Daerah Khusus Ibukota Jakarta Nomor : 98 Tahun 2004 tentang Wewenang Organisasi Industri Pariwisata di Propinsi daerah khusus Ibukota Jakarta.</li>
                    </ol>

                    <p class="mt-6 text-sm">Memperhatikan : Segala kebijakan pemerintah yang berhubungan dengan adanya ketentuan-ketentuan per Undang-undangan yang berlaku untuk kegiatan tersebut.</p>

                    <p class="text-center text-lg font-bold my-8">MEMBERIKAN - IJIN</p>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm mb-8">
                        <div class="col-span-1"><span class="data-label">Kepada</span></div>
                        <div class="col-span-2"><span class="data-value">: ${sik.organizer_name}</span></div>

                        <div class="col-span-1"><span class="data-label">Nama Organisasi</span></div>
                        <div class="col-span-2"><span class="data-value">: ${sik.organizer_name}</span></div>

                        <div class="col-span-1"><span class="data-label">Nama Penanggung Jawab</span></div>
                        <div class="col-span-2"><span class="data-value">: Sdr. ${sik.username}</span></div>

                        <div class="col-span-1"><span class="data-label">Pekerjaan</span></div>
                        <div class="col-span-2"><span class="data-value">: ${sik.job}</span></div>

                        <div class="col-span-1"><span class="data-label">Alamat</span></div>
                        <div class="col-span-2"><span class="data-value">: ${sik.place}</span></div>
                        <div class="col-span-1"></div>
                        <div class="col-span-2"><span class="data-value"></span></div>
                    </div>

                    <div class="flex justify-end mt-8">
                        <div class="text-center text-sm">
                            <p>Dikeluarkan di Magetan</p>
                            <p>Pada tanggal ${formattedSubmissionDate}</p>
                            <p class="mt-4 font-bold">A.n. KEPALA KEPOLISIAN NEGARA REPUBLIK INDONESIA</p>
                            <p class="font-bold">KEPALA KEPOLISIAN DAERAH BENDO</p>
                            <p class="mt-8 font-bold"> ${sikOfficer.username}</p>
                            <p class="mt-1">Pangkat. Nrp. ${sikOfficer.nrp}</p>
                        </div>
                    </div>

                    <div class="absolute bottom-4 right-4 text-xs text-gray-500">
                        1.237
                    </div>
                </div>
            </div>

        </body>
        </html>
    `);

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    return pdfBuffer;
};


const generateSlkPdf = async (slk, slkOfficer) => {
    const polriEmblemBase64 = await getBase64Image('public/Lambang_Polri.png');
    const applicantPhotoBase64 = await getBase64Image(slk.passport_photo);

    const dateLost = new Date(slk.date_lost);

    const formattedTime = dateLost.toLocaleTimeString('id-ID');

    const formattedDateLost = dateLost.toLocaleDateString('id-ID', {
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
            <title>Surat Keterangan Tanda Lapor Kehilangan</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #f0f0f0; 
                }
                .surat-container {
                    max-width: 800px;
                    margin: 2rem auto;
                    background-color: #FCF8E8; 
                    padding: 2.5rem; 
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow: hidden;

                    background-image:
                        repeating-linear-gradient(0deg, #E0DBCF 0.5px, transparent 0.5px, transparent 8px),
                        repeating-linear-gradient(90deg, #E0DBCF 0.5px, transparent 0.5px, transparent 8px);
                    background-size: 8px 8px; 
                    background-repeat: repeat;
                    background-blend-mode: multiply;
                    background-position: center center;
                }

                .polri-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0.08; 
                    width: 70%; 
                    height: auto;
                    z-index: 0;
                    pointer-events: none;
                    filter: grayscale(100%); 
                }

                .relative.z-10 {
                    position: relative;
                    z-index: 10;
                }

                .data-label {
                    font-weight: normal; 
                    color: #333;
                    width: 150px; 
                    display: inline-block;
                }
                .data-value {
                    color: #555;
                    flex-grow: 1; 
                }
            </style>
        </head>
        <body>

            <div class="surat-container">
                <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Emblem Watermark" class="polri-watermark">

                <div class="relative z-10">
                    <div class="text-center mb-8">
                        <p class="text-base font-bold">KEPOLISIAN NEGARA REPUBLIK INDONESIA</p>
                        <p class="text-sm">DAERAH MAGETAN</p>
                        <p class="text-sm">RESOR BENDO</p>
                        <div class="mt-4">
                            <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Emblem Watermark" class="polri-watermark">
                        </div>
                    </div>

                    <div class="text-center mb-6">
                        <p class="text-xl font-bold uppercase tracking-wider">SURAT KETERANGAN TANDA LAPOR KEHILANGAN</p>
                        <p class="text-sm mt-1">Nomor: SKTL/1283/V/2020/RES TALA/SPKT</p>
                    </div>

                    <p class="mb-4 text-sm leading-relaxed">
                        <span class="inline-block align-top mr-2">-</span> Yang bertandatangan di bawah ini menerangkan bahwa pada hari ini tanggal ${formattedDateLost} sekitar jam ${formattedTime} Wita telah datang ke SPKT POLRES TANAH LAUT, seorang laki-laki berkebangsaan WNI mengaku bernama: <span class="data-value">.......................................................................</span>
                    </p>

                    <div class="grid grid-cols-[150px_1fr] gap-y-1 text-sm mb-4 ml-4">
                        <div><span class="data-label">Nama</span></div>
                        <div>: <span class="data-value">${slk.reporter_name}</span></div>

                        <div><span class="data-label">Tempat / Tanggal Lahir</span></div>
                        <div>: <span class="data-value">${slk.place_date}</span></div>

                        <div><span class="data-label">Agama</span></div>
                        <div>: <span class="data-value">${slk.religion}</span></div>

                        <div><span class="data-label">Pekerjaan</span></div>
                        <div>: <span class="data-value">${slk.jobs}</span></div>

                        <div><span class="data-label">Kewarganegaraan</span></div>
                        <div>: <span class="data-value">WNI</span></div>

                        <div><span class="data-label">Alamat</span></div>
                        <div>: <span class="data-value">${slk.complete_address}</span></div>
                        <div></div>

                        <div><span class="data-label">No Telp./Fax / Email</span></div>
                        <div>: <span class="data-value">${slk.contact_reporter}</span></div>
                    </div>

                    <p class="mb-2 text-sm leading-relaxed">
                        <span class="inline-block align-top mr-2">-</span> Telah melaporkan tentang kehilangan / tercecer surat - surat berharga berupa: <span class="data-value">...................................................................................</span>
                    </p>
                    <ol class="list-decimal text-sm mb-4 ml-4">
                        <p class="text-sm mt-2 ml-4">-- ${slk.chronology} --</p>
                    </ol>

                    <p class="mb-8 text-sm leading-relaxed">
                        <span class="inline-block align-top mr-2">-</span> Demikian Surat Keterangan Tanda Lapor Kehilangan ini dibuat untuk dipergunakan seperlunya. <span class="data-value">..................................................................................................</span>
                    </p>

                    <div class="flex justify-between items-start text-sm">
                        <div>
                            <p>PELAPOR</p>
                            <div class="mt-8 mb-2">
                                <div class="h-12 w-40 border-b border-gray-400 mx-auto"></div>
                            </div>
                            <p class="font-bold">${slk.reporter_name}</p>
                        </div>
                        <div class="text-center">
                            <p>Pelaihari, ${formattedDateLost}</p>
                            <p>A.n. KEPALA KEPOLISIAN RESOR BENDO</p>
                            <p>Ka.SPKT</p>
                            <p>u.b.</p>
                            <p>KANIT II</p>
                            <div class="mt-8 mb-2 flex justify-center items-center">
                                <div class="h-12 w-40 border-b border-gray-400 mx-auto"></div>
                            </div>
                            <p class="font-bold">${slkOfficer.username}</p>
                            <p>${slkOfficer.title} NRP ${slkOfficer.nrp}</p>
                        </div>
                    </div>

                    <div class="mt-8 text-xs text-gray-700">
                        <p>Catatan :</p>
                        <p>Surat ini bukan pengganti surat yang hilang akan tetapi untuk melakukan pengurusan surat yang</p>
                        <p>hilang, berlaku selama 30 hari sejak tanggal dikeluarkan.</p>
                    </div>

                </div>
            </div>

        </body>
        </html>
    `);

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    return pdfBuffer;
};


const generatePmPdf = async (pm, pmOfficer) => {
    const polriEmblemBase64 = await getBase64Image('public/Lambang_Polri.png');
    const applicantPhotoBase64 = await getBase64Image(pm.passport_photo);

    const complaintDate = new Date(pm.complaint_date);

    const formattedTime = complaintDate.toLocaleTimeString('id-ID');

    const formattedComplaintDate = complaintDate.toLocaleDateString('id-ID', {
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
            <title>Surat Penerimaan Laporan / Pengaduan</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #f0f0f0; /
                }
                .surat-container {
                    max-width: 800px;
                    margin: 2rem auto;
                    background-color: #FCF8E8; 
                    padding: 2.5rem;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow: hidden;

                    background-image:
                        repeating-linear-gradient(0deg, #E0DBCF 0.5px, transparent 0.5px, transparent 8px),
                        repeating-linear-gradient(90deg, #E0DBCF 0.5px, transparent 0.5px, transparent 8px);
                    background-size: 8px 8px; 
                    background-repeat: repeat;
                    background-blend-mode: multiply;
                    background-position: center center;
                }

                .polri-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0.08; 
                    width: 70%; 
                    height: auto;
                    z-index: 0;
                    pointer-events: none;
                    filter: grayscale(100%); 
                }

                .relative.z-10 {
                    position: relative;
                    z-index: 10;
                }

                .data-label {
                    font-weight: normal; 
                    color: #333;
                    width: 150px;
                    display: inline-block;
                    vertical-align: top;
                }
                .data-value {
                    color: #555;
                    flex-grow: 1; 
                    word-wrap: break-word;
                }
                .indent-first-line::first-line {
                    text-indent: 2rem; 
                }
                .detail-row {
                    display: flex;
                    align-items: baseline; 
                    margin-bottom: 0.25rem;
                }
            </style>
        </head>
        <body>

            <div class="surat-container">
                <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Emblem Watermark" class="polri-watermark">

                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-6">
                        <div class="text-left">
                            <p class="text-base font-bold">KEPOLISIAN NEGARA REPUBLIK INDONESIA</p>
                            <p class="text-sm">DAERAH JAWA TIMUR</p>
                            <p class="text-sm">SEKTOR BENDO</p>
                            <p class="text-xs">Gorang Gareng , Jl. Raya Bendo No.209, Dusun Bendo, Belotan, Kec. Magetan, Kabupaten Magetan, Jawa Timur</p>
                        </div>
                        <div class="text-right text-xs">
                            <p>Model B-1</p>
                        </div>
                    </div>

                    <div class="text-center mb-6">
                        <img src="data:image/png;base64,${polriEmblemBase64}" alt="Polri Emblem Watermark" class="polri-watermark">
                    </div>

                    <div class="text-center mb-6">
                        <p class="text-xl font-bold uppercase tracking-wider">SURAT PENERIMAAN LAPORAN / PENGADUAN</p>
                        <p class="text-sm mt-1">NOMOR POLISI : STPL/04/X/2022 SPK</p>
                    </div>

                    <p class="mb-4 text-sm leading-relaxed">
                        Yang bertanda tangan dibawah ini menerangkan bahwa pada hari Rabu tanggal ${formattedComplaintDate} sekitar Jam ${formattedTime} telah datang ke Polsek Bendo seorang Warga Indonesia mengaku.
                    </p>

                    <div class="text-sm mb-4">
                        <div class="detail-row">
                            <span class="data-label">Nama</span>
                            <span>: <span class="data-value">${pm.complainant_name}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Tempat Tgl Lahir</span>
                            <span>: <span class="data-value">${pm.complainant_address}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Agama</span>
                            <span>: <span class="data-value">${pm.religion}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Suku/Bangsa</span>
                            <span>: <span class="data-value">${pm.nationality}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Pekerjaan</span>
                            <span>: <span class="data-value">${pm.job}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Alamat</span>
                            <span>: <span class="data-value">${pm.complainant_address}</span></span>
                        </div>
                    </div>

                    <p class="mb-2 text-sm">Berdasarkan Laporan Polisi No. Pol : 708/K/X/2022/Sek Karsa</p>
                    <div class="text-sm mb-4 ml-4">
                        <div class="detail-row">
                            <span class="data-label">Pada tanggal</span>
                            <span>: <span class="data-value">${formattedComplaintDate} Jam ${formattedTime} WIB</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Melaporkan Tentang</span>
                            <span>: <span class="data-value">${pm.complaint_category}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label"></span>
                            <span>: <span class="data-value">${pm.complaint_content}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Tanggal Kejadian</span>
                            <span>: <span class="data-value">${formattedComplaintDate} Jam ${formattedTime}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Tempat Kejadian</span>
                            <span>: <span class="data-value">${pm.place}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Atas Kejadian</span>
                            <span>: <span class="data-value">Pelapor</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Alamat</span>
                            <span>: <span class="data-value">Tersebut diatas</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="data-label">Kerugian</span>
                            <span>: <span class="data-value">${pm.complainant_loss}</span></span>
                        </div>
                    </div>

                    <p class="mb-8 text-sm leading-relaxed">
                        Surat Tanda Penerimaan Laporan / Pengaduan ini di perlukan untuk : Penyelidikan <br>
                        Demikian surat keterangan tanda penerimaan laporan/pengaduan ini agar dapat di pergunakan seperlunya.
                    </p>

                    <div class="flex justify-between items-start text-sm mt-8">
                        <div>
                            <p class="font-bold">PELAPOR</p>
                            <div class="mt-12 mb-2">
                                <div class="h-12 w-40 border-b border-gray-400 mx-auto"></div>
                            </div>
                            <p class="font-bold text-base">${pm.complainant_name}</p>
                        </div>
                        <div class="text-center">
                            <p>KEPALA KEPOLISIAN SEKTOR BENDO</p>
                            <div class="mt-8 mb-2 flex justify-center items-center">
                                <div class="h-12 w-40 border-b border-gray-400 mx-auto"></div>
                            </div>
                            <p class="font-bold">${pmOfficer.username}</p>
                            <p>${pmOfficer.title} NRP ${pmOfficer.nrp}</p>
                        </div>
                    </div>

                </div>
            </div>

        </body>
        </html>
    `);

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    return pdfBuffer;
};


export default { 
    generateSkckPdf,
    generateSikPdf, 
    generateSlkPdf , 
    generatePmPdf 
};