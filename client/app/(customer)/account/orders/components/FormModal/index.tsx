import "./FormModal.css";
import { useAcceptOrderMutation } from "@/store/api/ecommerce";
import { useCallback, useState } from "react";
import Image from "next/image";
import FormParser from "@/app/utils/formParser";
import { Input, ReviewStars } from "@components";
import { useParsedUrlData } from "@/app/hooks/useParsedUrlData";
import { OrderUsableType } from "@types";

function FormModal({
  order,
  refetch,
}: {
  order: Pick<OrderUsableType, "_id" | "vendorId">;
  refetch: any;
}) {
  const [acceptOrder] = useAcceptOrderMutation();
  const [handleSubmitImage, images] = useParsedUrlData();
  const [star, setStar] = useState(0);
  const formParser = new FormParser();
  const handleSubmitReview = useCallback(() => {
    formParser.getFormAsFormData.append("vendorId", order.vendorId._id);
    formParser.getFormAsFormData.append("orderId", order._id);
    formParser.getFormAsFormData.append("status", "finished");
    formParser.getFormAsFormData.append("star", star.toString());
    acceptOrder(formParser.getFormAsFormData).then(() => refetch());
  }, [acceptOrder, formParser.getFormAsFormData, order, refetch, star]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formParser.setForm(e);
        handleSubmitReview();
      }}
      encType="multipart/form-data"
    >
      <Input
        multiple
        accept="image/*"
        type="file"
        name="images"
        onChange={handleSubmitImage}
        label="Rasmlar"
      />
      <div className="flex">
        {images[0] &&
          images?.map((e, i) => (
            <Image
              className="object-cover w-[100px] h-[100px] m-2"
              key={i}
              src={e}
              width={50}
              height={50}
              alt="Skrinshot"
              unoptimized
            />
          ))}
      </div>
      <Input type="text" label="Izoh" name="body" />
      <ReviewStars star={star} setStar={setStar} />
      <Input type="submit" value="Jo'natish" />
    </form>
  );
}

export default FormModal;
