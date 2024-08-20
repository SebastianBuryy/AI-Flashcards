import React, { memo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MdDownload } from "react-icons/md";
import { Button } from "@/components/ui/button";

const PDFDownloadButton = memo(({ document, fileName }) => {
  return (
    <Button variant="default" className="mb-4">
      <MdDownload className="w-4 h-4 mr-2" />
      <PDFDownloadLink document={document} fileName={fileName}>
        {({ loading }) => (loading ? "Download PDF" : "Download PDF")}
      </PDFDownloadLink>
    </Button>
  );
});

export default PDFDownloadButton;
