import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import * as pdfjsLib from 'pdfjs-dist';

// Set workerSrc for PDF.js globally
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js';

const PdfViewer = ({ proofUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div>
            <Document file={proofUrl} onLoadSuccess={onLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>
            <div>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
                    Previous
                </button>
                <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PdfViewer
