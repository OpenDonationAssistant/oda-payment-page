import React, { useState } from "react";
import PlayIcon from "../../../../icons/PlayIcon";
import classes from "./MediaItemComponent.module.css";
import DownIcon from "../../../../icons/DownIcon";
import CloseIcon from "../../../../icons/CloseIcon";
import UpIcon from "../../../../icons/UpIcon";
import { observer } from "mobx-react-lite";

interface MediaData {
  originId: string;
  thumbnail: string;
}

interface MediaProps {
  data: MediaData;
  deleteHandler: () => void;
}

function createVkIframeSrc(id: string) {
  return `https://vk.com/video_ext.php?oid=${id.replace(
    "_",
    "&id=",
  )}&hd=2&autoplay=0`;
}

const TimestampComponent = observer(({ label }: { label: string }) => {
  return (
    <div className={`${classes.timestamp}`}>
      <div className={`${classes.timestamplabel}`}>{label}</div>
      <div className={`${classes.timestampvalue}`}>--:--:--</div>
    </div>
  );
});

export default function MediaItemComponent({
  data,
  deleteHandler,
}: MediaProps) {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <>
      <div>
        <div className={`${classes.item}`}>
          <div
            className={`${classes.titlecontainer}`}
            onClick={() => setCollapsed((oldValue) => !oldValue)}
          >
            <PlayIcon />
            <span className={`${classes.mediatitle}`}>{data.title}</span>
            <div className={`${classes.buttons}`}>
              {collapsed ? <DownIcon /> : <UpIcon />}
              <span className={`${classes.delete}`} onClick={deleteHandler}>
                <CloseIcon />
              </span>
            </div>
          </div>
          {!collapsed && <div className={`${classes.preview}`}>
            {data.provider === "youtube" && (
              <iframe
                width="100%"
                src={`https://www.youtube.com/embed/${data.originId}?autoplay=0`}
              />
            )}
            {data.provider === "vk" && (
              <iframe width="100%" src={createVkIframeSrc(data.originId)} />
            )}
          </div>}
          {/* {!collapsed && <div className={`${classes.timestamps}`}> */}
          {/*   <TimestampComponent label="Начало" /> */}
          {/*   <TimestampComponent label="Конец" /> */}
          {/* </div>} */}
        </div>
      </div>
    </>
  );
}
