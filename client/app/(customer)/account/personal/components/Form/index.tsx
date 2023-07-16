import Image from "next/image";
import React from "react";
import { UserType } from "@/types";
import { Button, Input } from "@components";
import { useUpdateUserInfoMutation } from "@/store/api/ecommerce";
import FormParser from "@/app/utils/formParser";
import { useParsedUrlData } from "@/app/hooks/useParsedUrlData";

function Form({ user }: { user: UserType }) {
  const [updateUserInfo] = useUpdateUserInfoMutation();
  const form = new FormParser();
  const [handleSubmitImage, images] = useParsedUrlData(
    `http://localhost:4000/api/files/image/${user.image}`,
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.setForm(e);
        updateUserInfo(form.getFormAsFormData);
      }}
    >
      <label>
        <Image
          width={200}
          height={200}
          className="rounded-full object-cover w-[200px] h-[200px]"
          src={
            images.length
              ? images[0].toString()
              : "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
          }
          alt="Profil rasmi"
          unoptimized
        />
        <input onChange={handleSubmitImage} name="image" type="file" hidden />
      </label>
      <Input
        name="name"
        type="text"
        label="Ismingiz"
        placeholder="Ismingiz"
        fullWidth
        defaultValue={user.name}
      />
      <Input
        type="text"
        name="username"
        label="Foydalanuvchi nomi"
        placeholder="Foydalanuvchi nomi"
        fullWidth
        defaultValue={user.username}
      />
      <Input
        type="email"
        name="email"
        label="Pochtangiz"
        placeholder="Emailingiz"
        fullWidth
        defaultValue={user.email}
      />
      <Input
        type="tel"
        name="phone"
        label="Telefon raqamingiz"
        defaultValue={user.phone}
        fullWidth
      />
      <fieldset name="address">
        <legend>Joylashuvingiz</legend>
        <Input
          label="Viloyat"
          fullWidth
          type="text"
          name="state"
          defaultValue={user.address?.state}
        />
        <Input
          type="text"
          label="Joylashuv"
          fullWidth
          name="location"
          defaultValue={user.address?.location}
        />
        <Input
          type="text"
          label="Pochta indeksi"
          name="zipCode"
          defaultValue={user.address?.zipCode}
          fullWidth
        />
      </fieldset>
      <fieldset name="payment">
        <Input
          type="text"
          label="Karta raqami"
          name="cardNumber"
          pattern="/[\d{16}]/"
          defaultValue={user.payment?.cardNumber}
          required
          fullWidth
        />
      </fieldset>
      <Input
        type="password"
        label="Parol"
        name="password"
        placeholder="Yangi parol"
        fullWidth
      />
      <Button type="submit">Yangilash</Button>
    </form>
  );
}

export default Form;
