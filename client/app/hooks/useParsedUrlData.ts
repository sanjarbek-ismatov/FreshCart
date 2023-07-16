import React from "react";

function useParsedUrlData(defImage?: string) {
  const images: (string | ArrayBuffer)[] = [];
  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    Array.from(event.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        e.target?.result && images.push(e.target?.result);
      };
      reader.readAsDataURL(file);
    });
  };
  return [handleSubmit, images.length ? images : [defImage]] as [
    typeof handleSubmit,
    [string],
  ];
}

export { useParsedUrlData };
