"use client";

// imports
import { FiUploadCloud } from "react-icons/fi";
import { LuFileSymlink } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import ReactDropzone from "react-dropzone";
import bytesToSize from "@/utils/bytes-to-size";
import fileToIcon from "@/utils/file-to-icon";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import compressFileName from "@/utils/compress-file-name";
import { Skeleton } from "@/components/ui/skeleton";
import convertFile from "@/utils/convert";
import { ImSpinner3 } from "react-icons/im";
import { MdDone } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { HiOutlineDownload } from "react-icons/hi";
import { BiError } from "react-icons/bi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import loadFfmpeg from "@/utils/load-ffmpeg";
import type { Action } from "@/types";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const extensions: { [key: string]: string[] } = {
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
};

export default function Dropzone() {
  // variables & hooks
  const { toast } = useToast();
  const [is_hover, setIsHover] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [is_ready, setIsReady] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [is_loaded, setIsLoaded] = useState<boolean>(false);
  const [is_converting, setIsConverting] = useState<boolean>(false);
  const [is_done, setIsDone] = useState<boolean>(false);
  const ffmpegRef = useRef<any>(null);

  // functions
  const reset = () => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  };

  const downloadAll = (): void => {
    for (let action of actions) {
      if (!action.is_error) download(action);
    }
  };

  const download = (action: Action) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    // Clean up after download
    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };

  const convert = async (): Promise<any> => {
    console.log("start converting");
    let tmp_actions = actions.map((elt) => ({ ...elt, is_converting: true }));
    setActions(tmp_actions);
    setIsConverting(true);

    for (let action of tmp_actions) {
      try {
        console.log("trying to convert");
        const { url, output } = await convertFile(ffmpegRef.current, action);

        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? {
                ...elt,
                is_converted: true,
                is_converting: false,
                url,
                output,
              }
            : elt,
        );
        setActions(tmp_actions);
      } catch (err) {
        console.log("error in converting");
        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? {
                ...elt,
                is_converted: false,
                is_converting: false,
                is_error: true,
              }
            : elt,
        );
        setActions(tmp_actions);
      }
    }

    setIsDone(true);
    setIsConverting(false);
    console.log("process end");
  };

  const handleUpload = (data: Array<any>): void => {
    handleExitHover();
    setFiles(data);
    const tmp: Action[] = [];
    data.forEach((file: any) => {
      const formData = new FormData();
      tmp.push({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
        to: null,
        file_type: file.type,
        file,
        is_converted: false,
        is_converting: false,
        is_error: false,
      });
    });
    setActions(tmp);
  };

  const handleHover = (): void => setIsHover(true);
  const handleExitHover = (): void => setIsHover(false);

  const updateAction = (file_name: String, to: String) => {
    setActions(
      actions.map((action): Action => {
        if (action.file_name === file_name) {
          return { ...action, to };
        }
        return action;
      }),
    );
  };

  const checkIsReady = (): void => {
    let tmp_is_ready = true;
    actions.forEach((action: Action) => {
      if (!action.to) tmp_is_ready = false;
    });
    setIsReady(tmp_is_ready);
  };

  const deleteAction = (action: Action): void => {
    setActions(actions.filter((elt) => elt !== action));
    setFiles(files.filter((elt) => elt.name !== action.file_name));
  };

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else checkIsReady();
  }, [actions]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFfmpeg();
    ffmpegRef.current = ffmpeg_response;
    setIsLoaded(true);
  };
  // returns
  if (actions.length) {
    return (
      <div className="space-y-6">
        {actions.map((action: Action, i: any) => (
          <div
            key={i}
            className="w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border h-fit lg:h-20 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between overflow-hidden"
          >
            {!is_loaded && (
              <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
            )}
            <div className="flex gap-4 items-center">
              <span className="text-2xl text-primary">
                {fileToIcon(action.file_type)}
              </span>
              <div className="flex items-center gap-1 w-96 ">
                <span className="text-md font-medium overflow-x-hidden text-wrap">
                  {compressFileName(action.file_name)}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({bytesToSize(action.file_size)})
                </span>
              </div>
            </div>

            {action.is_error ? (
              <Badge variant="destructive" className="flex gap-2">
                <span>Cannot convert to this format</span>
                <BiError />
              </Badge>
            ) : action.is_converted ? (
              <Badge
                variant="default"
                className="flex gap-2 bg-green-500 hover:bg-green-600"
              >
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.is_converting ? (
              <Badge variant="default" className="flex gap-2">
                <span>Converting</span>
                <span className="animate-spin">
                  <ImSpinner3 />
                </span>
              </Badge>
            ) : (
              <div className="text-muted-foreground text-md flex items-center gap-4">
                <span>Convert to</span>
                <Select
                  onValueChange={(value) => {
                    updateAction(action.file_name, value);
                  }}
                  value={action.to ? String(action.to) : ""}
                >
                  <SelectTrigger className="w-32 outline-none focus:outline-none focus:ring-0 text-center text-muted-foreground bg-background text-md font-medium">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="h-fit">
                    <div className="grid grid-cols-2 gap-2 w-fit">
                      {extensions[action.file_type.split("/")[0]].map(
                        (ext, i) => (
                          <SelectItem key={i} value={ext} className="mx-auto">
                            {ext.toUpperCase()}
                          </SelectItem>
                        ),
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-4">
              {action.is_converted && (
                <Button
                  onClick={() => download(action)}
                  size="sm"
                  variant="outline"
                  className="sm:rounded-full"
                >
                  <HiOutlineDownload className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
              <Button
                variant="outline"
                className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 sm:rounded-full sm:px-[0.6rem]"
                onClick={() => deleteAction(action)}
              >
                <MdClose className="mr-2 sm:mr-0 h-4 w-4" />
                <span className="sm:hidden">Remove</span>
              </Button>
            </div>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end">
          {!is_converting && (
            <Button
              onClick={convert}
              disabled={!is_ready || is_converting || is_done}
              className="w-full sm:w-max mt-2 relative z-20 block cursor-pointer rounded-xl bg-primary px-8 py-3 text-center text-sm text-white font-semibold shadow-2xl flex items-center justify-center"
            >
              Convert All
            </Button>
          )}
          {is_done && (
            <Button
              onClick={downloadAll}
              variant="outline"
              disabled={!is_done || is_converting}
              className="w-full sm:w-max mt-2 sm:ml-2 relative z-20 block cursor-pointer rounded-xl px-8 py-3 text-center text-sm font-semibold shadow-2xl flex items-center justify-center"
            >
              Download All
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ReactDropzone
      onDrop={handleUpload}
      multiple={true}
      accept={{
        "image/*": extensions.image,
        "video/*": extensions.video,
        "audio/*": extensions.audio,
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <section className="w-full mx-auto bg-muted/50 border-2 rounded-xl border-dashed">
          <div
            {...getRootProps()}
            onMouseEnter={handleHover}
            onMouseLeave={handleExitHover}
            className="w-full h-full p-10 flex flex-col items-center justify-center space-y-4 cursor-pointer"
          >
            <input {...getInputProps()} />
            {is_hover ? (
              <LuFileSymlink className="text-5xl text-muted-foreground" />
            ) : (
              <FiUploadCloud className="text-5xl text-muted-foreground" />
            )}
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-lg text-muted-foreground font-medium">
                Drag & drop files here or{" "}
                <span className="text-primary">Browse</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Images, videos, and audio supported
              </p>
            </div>
          </div>
        </section>
      )}
    </ReactDropzone>
  );
}
