// imports
import Dropzone from "@/components/dropzone";

export default function Home() {
    return (
        <div className="space-y-16 pb-8 max-w-7xl mx-auto">
            {/* Title + Desc */}
            <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-medium text-center">
                    Free & Unlimited File Converter
                </h1>
                <p className="text-muted-foreground text-md md:text-lg text-center md:px-24 xl:px-44 2xl:px-52">
                    Unleash your creativity with Converture – your go-to online
                    tool for unlimited, free multimedia conversion. Effortlessly
                    transform images, audio, and videos without restrictions.
                    Start converting now and elevate your content like never
                    before!
                </p>
            </div>

            {/* Upload Box */}
            <Dropzone />
        </div>
    );
}
