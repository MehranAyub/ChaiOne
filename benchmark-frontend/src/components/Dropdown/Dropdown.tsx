import React from "react";
import {
  Children,
  cloneElement,
  Dispatch,
  isValidElement,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Dropdown as BootstrapDropdown, Button } from "react-bootstrap";
import DropBoxArrow from "../../assets/dropbox-arrow.svg";
import Pencil from "../../assets/pencil.svg";
import { classNames } from "../../helpers";
import "./Dropdown.css";

type DropdownHeaderProps = {
  id?: string;
  label?: string;
  searchPlaceHolder?: string;
  onEditHanlder?: () => void;
  required?: boolean;
  deleteable?: boolean;
  creatable?: boolean;
  onDel?: boolean;
  onCreate?: boolean;
  isEditMode?: boolean;
  onSearch?: Dispatch<SetStateAction<string>>;
  onSelect: (eventKey: any | null, name: any | null) => void;
  searchStr?: string;
  onCreateItem?: (e) => void;
};
const DropdownHeader = ({
  id,
  label,
  searchPlaceHolder,
  onEditHanlder,
  isEditMode,
  onSearch,
  onCreate,
  onDel,
  searchStr,
  deleteable,
  onCreateItem,
}: DropdownHeaderProps) => {
  return (
    <form
      onSubmit={(e) => {
        onCreateItem(e);
        e.preventDefault();
      }}
    >
      {!isEditMode ? (
        <>
          <div className="Dropdown_Header">
            <>
              {id !== "Factor" && <>{id}</>}
              {onDel && (
                <img
                  src={Pencil}
                  alt="Pencil"
                  className="Dropdown_HeaderIcon"
                  onClick={onEditHanlder}
                />
              )}
            </>
          </div>
          {id !== "Factor" && (
            <input
              type="text"
              className="Dropdown_Search"
              placeholder={searchPlaceHolder}
              // value={searchStr}
              onKeyUp={({ target }) =>
                onSearch((target as HTMLInputElement).value)
              }
            />
          )}
          {onCreate && (
            <>
              {searchStr && searchStr.trim() !== "" && (
                <div
                  className="Dropdown_NewItemBtn"
                  onClick={(e) => {
                    onCreateItem(e);
                  }}
                >
                  {`+ Create  ${searchStr}`}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="Dropdown_Header">{`Manage ${id}`}</div>
      )}
    </form>
  );
};

type PropTypes = {
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  onDel?: boolean;
  onCreate?: boolean;
  creatable?: boolean;
  className?: string | undefined;
  disabled?: boolean;
  deleteable?: boolean;
  searchPlaceHolder?: string;
  children: ReactNode[] | ReactNode;
  onSelect: (eventKey: any | null, name: any | null) => void;
  selectedName?: string | null;
  onCreateItem?: (value: string) => void;
};

const Dropdown = ({
  id,
  label,
  className,
  disabled,
  placeholder,
  searchPlaceHolder = "Search",
  children,
  required,
  onDel,
  deleteable,
  creatable,
  onSelect,
  selectedName,
  onCreateItem,
}: PropTypes) => {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState<string>("");

  return (
    <div className={classNames("Dropdown", className)}>
      <label htmlFor="app-dropdown" className="Dropdown_Label">
        {label}
      </label>
      <BootstrapDropdown
        id="app-dropdown"
        onSelect={(key, event) => {
          selectedName == (event.target as HTMLHtmlElement).innerText
            ? onSelect("", "")
            : onSelect(key, (event.target as HTMLHtmlElement).innerText);
        }}
      >
        <BootstrapDropdown.Toggle
          disabled={disabled}
          variant="success"
          className="Dropdown_Toggle"
          style={{
            borderColor:
              selectedName === "Process"
                ? "#009999"
                : selectedName === "Usability"
                ? "#263790"
                : selectedName === "Culture"
                ? "#f15a24"
                : selectedName === "Tool Fit"
                ? "#2372b9"
                : !selectedName && required
                ? "#f74f10"
                : selectedName && id === "Scale"
                ? "#fff"
                : "",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between w-100"
            style={{
              color:
                selectedName === "Process"
                  ? "#009999"
                  : selectedName === "Usability"
                  ? "#263790"
                  : selectedName === "Culture"
                  ? "#f15a24"
                  : selectedName === "Tool Fit"
                  ? "#2372b9"
                  : "",
            }}
          >
            {selectedName ? (
              selectedName
            ) : (
              <div className="UnSelected_DropBoxLabel">{placeholder}</div>
            )}
            <img
              className="Dropdown_Arrow"
              src={DropBoxArrow}
              alt="DropBoxArrow"
            />
          </div>
        </BootstrapDropdown.Toggle>
        <BootstrapDropdown.Menu className="dropBoxMenu">
          <DropdownHeader
            onCreate={creatable ? true : false}
            onDel={deleteable ? true : false}
            required
            id={id}
            searchPlaceHolder={searchPlaceHolder}
            isEditMode={isEditMode}
            onEditHanlder={() => setEditMode(true)}
            searchStr={searchStr}
            onSearch={setSearchStr}
            onCreateItem={() => {
              onCreateItem?.(searchStr);
              setSearchStr("");
            }}
          />
          {/* THIS IS DONE TO PASS `isEditMode` PROP TO CHILDREN. 
          SEE: https://stackoverflow.com/a/65883017/9109541 */}
          {Children.map<ReactNode, ReactNode>(children, (child) => {
            // Implementing Search
            if (
              isValidElement(child) &&
              child.props.name?.toLowerCase().includes(searchStr?.toLowerCase())
            ) {
              return cloneElement(child, { isEditMode });
            }
          })}
          {isEditMode && (
            <Button
              className="Dropdown_Done btn-review"
              onClick={() => setEditMode(false)}
            >
              Done
            </Button>
          )}
        </BootstrapDropdown.Menu>
      </BootstrapDropdown>
      {!selectedName && required == true ? (
        <div className="Dropdown_required">Required *</div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Dropdown;
