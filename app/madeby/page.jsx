import { Heart } from "lucide-react";
import React from "react";

export default function Madeby() {
  return (
    <div className="min-h-screen justify-center items-center flex">
      <p className="justify-center gap-2 flex items-center">
        Jesse bhai <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
      </p>
    </div>
  );
}
