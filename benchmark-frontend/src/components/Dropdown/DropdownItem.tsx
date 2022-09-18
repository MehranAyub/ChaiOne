import { MouseEvent } from "react";
import { Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import Check from "../../assets/menu-check.svg";
import Trash from "../../assets/trash.svg";
import DisableTrash from "../../assets/disabledtrash.svg";
import { classNames } from "../../helpers";
import "./DropdownItem.css";

type PropTypes = {
  name?: string;
  id?: string;
  className?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  value?: string;
  isEditMode?: boolean;
  onDelete?: () => void;
};
const DropdownItem = ({
  className,
  name,
  id,
  value,
  isSelected = false,
  isEditMode = false,
  isDisabled = false,
  onDelete,
}: PropTypes) => {
  let Icon =
    isEditMode && isDisabled
      ? DisableTrash
      : isEditMode && !isDisabled
      ? Trash
      : Check;
  const handleDelete = (event: MouseEvent<HTMLElement>) => {
    if (isEditMode && !isDisabled) {
      event.stopPropagation();
      onDelete?.();
    } else {
      return undefined;
    }
  };

  const renderTooltip = (props) =>
    isEditMode && isDisabled ? (
      <Popover
        className="DropdownItem_OverlayWrapper"
        id="popover-basic"
        {...props}
      >
        <div className="DropdownItem_Overlay">
          You cannot Delete a {id} used in other surveys.
        </div>
      </Popover>
    ) : (
      <div></div>
    );
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <span className="d-inline-block">
      <Dropdown.Item
        as="button"
        className={classNames("DropdownItem_Name", className)}
        aria-selected={isSelected && !isEditMode}
        aria-disabled={isDisabled && isEditMode}
        value={value}
        eventKey={value}
        style={{
          pointerEvents: (isEditMode && isDisabled) ? 'none' : 'visible',
          color:
            name === "Process"
              ? "#009999"
              : name === "Usability"
              ? "#263790"
              : name === "Culture"
              ? "#f15a24"
              : name === "Tool Fit"
              ? "#2372b9"
              : "",
        }}
      >
        <span>{name}</span>
        <img
          src={Icon}
          alt=""
          className={classNames(
            "DropdownItem_SelectedIcon",
            isEditMode && "DropdownItem_SelectedIcon-Trash",
            isEditMode && isDisabled && "DropdownItem_Disabled"
          )}
          onClick={handleDelete}
        />
      </Dropdown.Item>
      </span>
    </OverlayTrigger>
  );
};

export default DropdownItem;
