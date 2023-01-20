import React, { useEffect, useCallback, useState, useRef } from "react";
import { blobToBlobURL, blobToDataURL } from "../../helpers/file";
import { readableSize } from "../../helpers/common";
import { message } from "antd";
import { Upload, Icon, Button } from "antd";
//import './styles.scss';

const imageRegex =
  /\.(ase|art|bmp|blp|cd5|cit|cpt|cr2|cut|dds|dib|djvu|egt|exif|gif|gpl|grf|icns|ico|iff|jng|jpeg|jpg|jfif|jp2|jps|lbm|max|miff|mng|msp|nitf|ota|pbm|pc1|pc2|pc3|pcf|pcx|pdn|pgm|PI1|PI2|PI3|pict|pct|pnm|pns|ppm|psb|psd|pdd|psp|px|pxm|pxr|qfx|raw|rle|sct|sgi|rgb|int|bw|tga|tiff|tif|vtf|xbm|xcf|xpm|3dv|amf|ai|awg|cgm|cdr|cmx|dxf|e2d|egt|eps|fs|gbr|odg|svg|stl|vrml|x3d|sxd|v2d|vnd|wmf|emf|art|xar|png|webp|jxr|hdp|wdp|cur|ecw|iff|lbm|liff|nrrd|pam|pcx|pgf|sgi|rgb|rgba|bw|int|inta|sid|ras|sun|tga)$/;
const videoRegex =
  /\.(3g2|3gp|aaf|asf|avchd|avi|drc|flv|m2v|m4p|m4v|mkv|mng|mov|mp2|mp4|mpe|mpeg|mpg|mpv|mxf|nsv|ogg|ogv|qt|rm|rmvb|roq|svi|vob|webm|wmv|yuv)$/;
const audioRegex = /\.(mid|midi|rm|ram|wma|aac|wav|ogg|mp3|mp4)$/;

export function isImage(url) {
  return url && url.match(imageRegex) != null;
}
export function isAudio(url) {
  return url && url.match(audioRegex) != null;
}
export function isVideo(url) {
  return url && url.match(videoRegex) != null;
}
export const FileViewComponent = ({
  name,
  url,
  type,
  disableDownload,
  ...rest
}) => {
  url = (url || "").split("?")[0];
  type = (type || "").toLowerCase();
  let icon, markup;
  if (type.indexOf("image") !== -1 || isImage(url)) {
    markup = <img width="200" src={url} {...rest} />;
  } else if (type.indexOf("video") !== -1 || isVideo(url)) {
    markup = <video controls width="200" height="200" src={url} {...rest} />;
  } else if (type.indexOf("audio") !== -1 || isAudio(url)) {
    markup = <audio controls width="200" height="200" src={url} {...rest} />;
  } else {
    switch (type) {
      case "application/pdf":
        icon = "file-pdf";
        break;
      case "text/html":
        icon = "global";
        break;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        icon = "copy";
        break;
      default:
        icon = "file";
        break;
    }
    markup = <Icon type={icon} />;
  }
  return (
    <div className="uploaded-file">
      {markup}
      <Button className="btn primary-btn-text">hello</Button>
      <span>{name || ""}</span>
      {!disableDownload && (
        <a className="download" href={url} target="_blank">
          <Icon type="download" />
        </a>
      )}
    </div>
  );
};
export const FileComponent = ({
  file,
  renderExtra,
  index,
  clearFile,
  exposedConfig,
  disableDownload,
  disabled,
}) => {
  let { dataUri, url, type, name } = file;

  return (
    <div className="file">
      <div className="data">
        <FileViewComponent
          name={name}
          url={dataUri || url}
          type={type}
          disableDownload={disableDownload}
        />
        {renderExtra instanceof Function
          ? renderExtra(file, index, exposedConfig)
          : null}
      </div>
      {!disabled && (
        <a
          className="remove"
          onClick={(e) => {
            e.preventDefault();
            clearFile(index);
          }}
        >
          <Icon type="close" />
        </a>
      )}
    </div>
  );
};

/**
 * @description File Picker Component
 * @type component
 * @author Inderdeep
 */
const Main = (props) => {
  const [fileList, setFileList] = useState([]);

  const { getChildren, renderExtra, disabled } = props;

  let uploadRef = useRef(null);

  const getUploadProps = useCallback(() => {
    const { uploadProps } = props;
    return {
      onRemove: () => {},
      beforeUpload: beforeUpload,
      accept: "image/*",
      multiple: false,
      showUploadList: false,
      style: {
        cursor: "pointer",
      },
      ...uploadProps,
    };
  }, []);

  const beforeUpload = useCallback((file) => {
    const { upload, onChange, maxFileSize, maxFileSizeMessage } = props;
    const multiple = getUploadProps().multiple;
    if (maxFileSize && file.size > maxFileSize) {
      message.error(
        maxFileSizeMessage ||
          "Maximum " + readableSize(maxFileSize) + " size is allowed"
      );
      return;
    }
    setTimeout(() => {
      blobToDataURL(file, (dataUri) => {
        file.dataUri = dataUri;
        let newFileList;
        if (multiple) {
          newFileList = [...fileList, file];
        } else {
          newFileList = [file];
        }

        setFileList(newFileList);
        if (upload && upload instanceof Function) {
          upload(file, newFileList);
        }
        /**
         * For Antd Design
         */
        if (onChange && onChange instanceof Function) {
          if (multiple) {
            onChange(newFileList, getUri());
          } else {
            onChange(file, getUri()[0]);
          }
        }
      });
    });
    return false;
  }, []);

  const clearFiles = useCallback(() => {
    setFileList([]);
  }, []);

  /**
   * Clear File
   * @param index
   */
  const clearFile = useCallback((index) => {
    const { onChange } = props;
    const { multiple } = getUploadProps();
    const newFileList = [].concat(fileList);
    newFileList.splice(index, 1);
    setFileList(newFileList);
    /**
     * For Antd Design
     */
    if (onChange && onChange instanceof Function) {
      if (multiple) {
        onChange(newFileList, getUri());
      } else {
        onChange(newFileList[0], getUri()[0]);
      }
    }
  }, []);

  const getUri = useCallback(() => {
    return fileList.map((file) => {
      return file.dataUri;
    });
  }, []);
  const getFileList = useCallback(() => {
    return fileList;
  }, []);

  const openDialog = useCallback(() => {
    if (uploadRef) {
      const uploadElement = uploadRef.querySelector("input[type='file']");
      uploadElement.click();
    }
  }, []);

  const getExposedConfig = useCallback(() => {
    return {
      getUri: getUri,
      clearFiles: clearFiles,
      clearFile: clearFile,
      openDialog: openDialog,
      getFileList: getFileList,
    };
  }, []);

  useEffect(() => {
    let newFileList = [];
    if (props.value) {
      if (Array.isArray(props.value)) {
        props.value.forEach((value) => {
          newFileList.push({
            dataUri: value,
          });
        });
      } else {
        newFileList.push({
          dataUri: props.value,
        });
      }
    }
    setFileList(newFileList);
  }, []);

  useEffect(() => {
    setFileList(props.value ? [].concat(props.value) : []);
  }, [props.value]);

  if (getChildren) {
    if (!getChildren instanceof Function) {
      console.error("getChildren should be of type function");
      return null;
    }
    return (
      <span ref={uploadRef}>
        <Upload {...getUploadProps()}>{getChildren(getExposedConfig())}</Upload>
      </span>
    );
  } else {
    const { multiple } = getUploadProps();
    return (
      <span ref={uploadRef}>
        {!disabled && (
          <Upload {...getUploadProps()}>
            {(multiple || fileList.length === 0) && (
              <div className="upload-container">
                <div>
                  <p>
                    <Icon type="plus" />
                    <Button>hello</Button>
                  </p>
                </div>
              </div>
            )}
          </Upload>
        )}
        <div className="file-list">
          {fileList.map((file, index) => {
            return (
              <FileComponent
                key={index}
                file={file}
                disabled={disabled}
                index={index}
                renderExtra={renderExtra}
                clearFile={clearFile}
                getExposedConfig={getExposedConfig()}
                disableDownload={file.uid}
              />
            );
          })}
        </div>
      </span>
    );
  }
};

export default Main;
