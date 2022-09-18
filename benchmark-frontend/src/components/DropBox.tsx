import React from "react";
import { Dropdown, Button } from "react-bootstrap";

// Images
import DropBoxArrow from "../assets/dropbox-arrow.svg";
import Pencil from "../assets/pencil.svg";
import Check from "../assets/menu-check.svg";
import Plus from "../assets/plus.svg";
import Trash from "../assets/trash.svg";

// Utils
import * as helpers from "../utils/helpers";

function findSelectedItem(id: string, items: any) {
  if (items && items.length) {
    const selectedItem = items.find((item: any) => item.id === id);

    if (!selectedItem) {
      return;
    }

    return selectedItem?.name ?? selectedItem?.text;
  }
}

function DropBox(props: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState(
    props.selectedItemID ? props.selectedItemID : ""
  );
  const [mSelectedItem, setMSelectedItem] = React.useState<any>([]);
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState<any>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState("");

  // on loading find the matched selected item index
  React.useEffect(() => {
    props.onLoad &&
      props.onLoad().then((items: any) => {
        const foundItem = items.find(
          (item: any) => item.id === props.selectedItemID
        );
        const itemID = foundItem ? props.selectedItemID : "";

        setSelectedItemId(itemID);
        props.setCompanyId && props.setCompanyId(itemID);
        setItems(items);
      });
  }, [props.selectedItemID]);

  React.useEffect(() => {
    props.setScale &&
      props.setScale(helpers.getScaleNameById(selectedItemId, props.scalesArr));
    props.setScaleType && props.setScaleType(selectedItemId);
  }, [selectedItemId]);

  React.useEffect(() => {
    const foundItem =
      props.factorsArr &&
      props.factorsArr.find((item: any) => item.id === props.selectedItemID);
    const itemID = foundItem ? props.selectedItemID : "";
    setSelectedItemId(itemID);
    setItems(props.factorsArr);
  }, [props.factorsArr]);

  React.useEffect(() => {
    const foundItem =
      props.scalesArr &&
      props.scalesArr.find((item: any) => item.id === props.selectedItemID);
    const itemID = foundItem ? props.selectedItemID : "";
    setSelectedItemId(itemID);
    setItems(props.scalesArr);
  }, [props.scalesArr]);

  React.useEffect(() => {
    const foundItem =
      props.processStepArr &&
      props.processStepArr.find(
        (item: any) => item.id === props.selectedItemID
      );
    const itemID = foundItem ? props.selectedItemID : "";
    setSelectedItemId(itemID);
    setItems(props.processStepArr);
  }, [props.processStepArr]);

  React.useEffect(() => {
    const foundItem =
      props.predefinedScaleTypes &&
      props.predefinedScaleTypes.find(
        (item: any) => item.id === props.selectedItemID
      );
    const itemID = foundItem ? props.selectedItemID : "";
    setSelectedItemId(itemID);
    setItems(props.predefinedScaleTypes);
  }, [props.predefinedScaleTypes]);

  React.useEffect(() => {
    const foundItem =
      props.projectsArr &&
      props.projectsArr.find((item: any) => item.id === props.selectedItemID);
    const itemID = foundItem ? props.selectedItemID : "";
    setSelectedItemId(itemID);
    setItems(props.projectsArr);
  }, [props.projectsArr]);

  const addAction = async (type: string, ...params: any) => {
    if (type === "Company") {
      const companyName = params[0];
      const existingCompany = items.find(
        (x: any) => x.name.toLowerCase() === companyName?.toLowerCase()
      );
      if (!!existingCompany) return;
    }

    let item = await props.addAction(params[0], props.companyId);
    let itemObj = null;

    if (type === "Project") {
      itemObj = {
        id: item.id,
        name: params[0],
      };

      props.updateProjectForSurveyAction &&
        props.updateProjectForSurveyAction(props.surveyId, item.id);
      setSelectedItemId(item.id);
      props.setProjectId(item.id);
      props.updateOverviewProjectId(item.id);
    } else if (type === "Company") {
      itemObj = {
        id: item.id,
        name: params[0],
      };

      props.assignAction && props.assignAction(props.surveyId, item.id);
      item.id === ""
        ? props.setDisableProject(true)
        : props.setDisableProject(false);
      setSelectedItemId(item.id);
      props.assignAction(props.surveyId, item.id);

      if (props.projectId) {
        props.updateProjectForSurveyAction(props.surveyId, null);
      }

      props.setCompanyId(item.id);
      props.updateOverviewCompanyId(item.id);
      props.setProjectId("");
    } else if (type === "Scale") {
      itemObj = {
        id: item.id,
        name: params[0],
      };
      console.log("Add Scale called");

      props.assignAction && props.assignAction(props.questionId, item.id, "");
      props.setScalesArr([...items, itemObj]);
    } else if (type.toLowerCase() === "process step") {
      itemObj = {
        id: item.id,
        text: params[0],
      };
      props.setProcessStepArr([...items, itemObj]);
      if (prop.assignAction && props.rowId) {
        props.assignAction(props.questionId, item.id, props.rowId);
        setSelectedItemId(item.id);
        props.setSubQuestProcessStepId(props.questionId, item.id, props.rowId);
      } else if (props.assignAction && !props.rowId) {
        props.assignAction(props.questionId, item.id);
        setSelectedItemId(item.id);
        props.setProcessStepId(props.questionId, item.id);
      }

      props.assignAction &&
        props.assignAction(props.questionId, item.id, props.rowId);
    }

    setItems([...items, itemObj]);
    setSelectedItemId(item.id);

    props.isMulti && setMSelectedItem([...mSelectedItem, items.length]);
    setSearch("");
  };

  const removeAction = async (itemId: string) => {
    const defaultItems = items;
    const removedItemsList = items.filter((i: any) => i.id !== itemId);
    setItems(removedItemsList);

    if (props.header === "Scale") {
      props.setScalesArr([...removedItemsList]);
      let isUsed = false;

      await props.removeAction(itemId).then((response: any) => {
        if (response && response.status !== 200) {
          isUsed = true;
          props.setShow(true);
        }
      });

      if (isUsed) {
        setItems(defaultItems);
        props.setScalesArr(defaultItems);
        return;
      }
    } else if (props.header.toLowerCase() === "process step") {
      let cannotBeDeleted = false;

      await props
        .removeAction(itemId)
        .then((response: any) => {
          if (response && response.status !== 204) {
            cannotBeDeleted = response.detail.includes("cannot be deleted");
          }
        })
        .catch((error: any) => console.error("error", error));

      if (cannotBeDeleted) {
        setItems(defaultItems);
        props.setShow(true);
        return;
      }

      props.setProcessStepArr([...removedItemsList]);
    } else if (props.header.toLowerCase() === "company") {
      await props.removeAction(itemId).then((response: any) => {
        const cannotBeDeleted =
          response &&
          response.status !== 200 &&
          response.detail.includes("It is used on another survey.")
            ? true
            : false;
        if (cannotBeDeleted) {
          props.setShow(true);
          setItems(defaultItems);
          return;
        }
      });
    } else {
      props.removeAction(itemId);
    }
  };

  const assignAction = (type: string, ...params: any) => {
    let id = selectedItemId === params[0] ? "" : params[0];
    if (type.toLowerCase() === "company") {
      id === ""
        ? props.setDisableProject(true)
        : props.setDisableProject(false);
      setSelectedItemId(id);
      props.assignAction(props.surveyId, id);
      if (props.projectId) {
        props.updateProjectForSurveyAction(props.surveyId, null);
      }
      props.setCompanyId(id);
      props.updateOverviewCompanyId(id);
      props.updateOverviewProjectId(id);
    } else if (type.toLowerCase() === "project") {
      props.updateProjectForSurveyAction(props.surveyId, id);
      setSelectedItemId(id);
      props.setProjectId(id);
      props.updateOverviewProjectId(id);
    } else if (
      type.toLowerCase() === "scale" &&
      props.predefinedScaleTypes === undefined
    ) {
      if (props.rowId) {
        props.assignAction(
          props.surveyId,
          props.questionId,
          props.rowId,
          id,
          ""
        );
        props.setScaleDataHasChanged({
          questionId: props.questionId,
          scaleId: id,
          rowId: props.rowId,
        });
      } else {
        props.assignAction(props.questionId, id, "");
        props.setScaleDataHasChanged({
          questionId: props.questionId,
          scaleId: id,
        });
      }

      setSelectedItemId(id);
    } else if (
      type.toLowerCase() === "scale" &&
      props.predefinedScaleTypes &&
      props.predefinedScaleTypes.length > 0 &&
      id !== ""
    ) {
      console.log(
        " assign scale && props.predefinedScaleTypes other condition"
      );
      if (props.rowId) {
        console.log("if");

        props.assignAction(
          props.surveyId,
          props.questionId,
          props.rowId,
          "",
          id
        );
        props.setScaleDataHasChanged({
          questionId: props.questionId,
          predefinedScaleType: id,
          rowId: props.rowId,
        });
      } else {
        console.log("else");
        props.assignAction && props.assignAction(props.questionId, "", id);
        props.setScaleDataHasChanged({
          questionId: props.questionId,
          predefinedScaleType: id,
        });
      }
    } else if (type.toLowerCase() === "process step" && !props.rowId) {
      props.assignAction(props.questionId, id);
      console.log(props.questionId, id);
      setSelectedItemId(id);
      props.setProcessStepId(props.questionId, id);
    } else if (type.toLowerCase() === "process step" && props.rowId) {
      props.assignAction(props.questionId, id, props.rowId);
      props.setSubQuestProcessStepId(props.questionId, id, props.rowId);
      setSelectedItemId(id);
      props.setProcessStepId(props.questionId, id, props.rowId);
    } else if (type.toLowerCase() === "factor" && !props.rowId) {
      props.assignAction(props.questionId, id);
      setSelectedItemId(id);
      props.setFactorsId(props.questionId, id);
    } else if (type.toLowerCase() === "factor" && props.rowId) {
      props.setSubQuestFactorId(props.questionId, id, props.rowId);
      props.assignAction(props.questionId, id, props.rowId);
      setSelectedItemId(id);
    }
  };

  return (
    <main style={{ ...Style.wrapper, ...props.style }}>
      {props.header === "Scale" || props.header === "Factor" ? (
        ""
      ) : (
        <div style={Style.label}>{props.header}</div>
      )}
      <Dropdown
        onToggle={(isOpen) => {
          setSearch("");
          setHoveredItem("");
          setIsOpen(isOpen);
        }}
      >
        <Dropdown.Toggle
          disabled={
            props.header === "Project" &&
            (props.companyId === null ||
              props.companyId === "" ||
              props.disableProject)
              ? true
              : false
          }
          variant="success"
          style={{
            border: props.header === "Scale" ? "none" : "",
            height: props.header === "Factor" ? "24px" : "",
            borderColor:
              items && findSelectedItem(selectedItemId, items) === "Process"
                ? "#009999"
                : items &&
                  findSelectedItem(selectedItemId, items) === "Usability"
                ? "#263790"
                : items && findSelectedItem(selectedItemId, items) === "Culture"
                ? "#f15a24"
                : items &&
                  findSelectedItem(selectedItemId, items) === "Tool Fit"
                ? "#2372b9"
                : "",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            {props.isMulti && (
              <>
                {mSelectedItem.length !== 0 && (
                  <div>
                    {props.items
                      .filter((e: string, i: number) =>
                        mSelectedItem.includes(i)
                      )
                      .join(", ")}
                  </div>
                )}
                {mSelectedItem.length === 0 && (
                  <div style={Style.unselectedDropBoxLabel}>Please Select</div>
                )}
              </>
            )}

            {!props.isMulti && (
              <>
                {selectedItemId !== "" && (
                  <div
                    style={{
                      color:
                        findSelectedItem(selectedItemId, items) === "Process"
                          ? "#009999"
                          : findSelectedItem(selectedItemId, items) ===
                            "Usability"
                          ? "#263790"
                          : findSelectedItem(selectedItemId, items) ===
                            "Culture"
                          ? "#f15a24"
                          : findSelectedItem(selectedItemId, items) ===
                            "Tool Fit"
                          ? "#2372b9"
                          : "",
                    }}
                  >
                    {findSelectedItem(selectedItemId, items)}
                  </div>
                )}
                {selectedItemId === "" && props.header === "Scale" && (
                  <div style={Style.unselectedDropBoxLabel}>Assign Scale</div>
                )}
                {selectedItemId === "" &&
                  props.header.toLowerCase() === "process step" && (
                    <div style={Style.unselectedDropBoxLabel}>
                      Assign Process Step
                    </div>
                  )}
                {selectedItemId === "" && props.header === "Factor" && (
                  <div style={Style.unselectedDropBoxLabel}>Unassigned</div>
                )}
                {selectedItemId === "" &&
                  props.header !== "Scale" &&
                  props.header !== "Factor" &&
                  props.header.toLowerCase() !== "process step" && (
                    <div style={Style.unselectedDropBoxLabel}>
                      Please Select
                    </div>
                  )}
              </>
            )}
            <img
              src={DropBoxArrow}
              alt="DropBoxArrow"
              style={{
                height: 24,
                width: 24,
                transform: isOpen ? "rotate(180deg)" : "",
              }}
            />
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropBoxMenu">
          {!!!props.noedit && (
            <div style={{ ...Style.label, ...Style.boxheaderLabel }}>
              {props.predefinedScaleTypes === undefined &&
                props.header !== "Factor" &&
                !isEditMode && (
                  <>
                    {props.header}
                    <img
                      src={Pencil}
                      alt="Pencil"
                      style={Style.icon}
                      onClick={() => setIsEditMode(true)}
                    />
                  </>
                )}
              {isEditMode && `Manage ${props.header}`}
            </div>
          )}

          {!isEditMode && (
            <input
              value={search}
              type="text"
              style={Style.search}
              placeholder={props.header === "Scale" ? "Enter Scale" : "Search"}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {!props.isMulti &&
            items &&
            items.map((item: any, i: number) => {
              return item?.name
                ? item?.name?.toLowerCase().includes(search?.toLowerCase()) && (
                    <Dropdown.Item
                      as="button"
                      key={`${props.header}-${item.name}-${i}`}
                      onMouseOver={(e: any) => {
                        if (e.target.outerText) {
                          setHoveredItem(e.target.outerText);
                        }
                      }}
                      onClick={() => {
                        if (!isEditMode) {
                          assignAction(props.header, item.id);
                        }
                      }}
                      style={{
                        color:
                          item.name === "Process"
                            ? "#009999"
                            : item.name === "Usability"
                            ? "#263790"
                            : item.name === "Culture"
                            ? "#f15a24"
                            : item.name === "Tool Fit"
                            ? "#2372b9"
                            : "",
                      }}
                    >
                      <span
                        className={`${
                          item.id === selectedItemId ? "selectedItem" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                      {!isEditMode && item.id === selectedItemId && (
                        <img src={Check} alt="Check" style={Style.icon} />
                      )}
                      {isEditMode &&
                        hoveredItem === item.name.replace(/ +(?= )/g, "") && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAction(item.id);
                            }}
                          >
                            <img src={Trash} alt="Trash" style={Style.icon} />
                          </div>
                        )}
                    </Dropdown.Item>
                  )
                : item?.text?.toLowerCase().includes(search?.toLowerCase()) && (
                    <Dropdown.Item
                      as="button"
                      key={`${props.header}-${item.text}-${i}`}
                      onMouseOver={(e: any) => {
                        if (e.target.outerText) {
                          setHoveredItem(e.target.outerText);
                        }
                      }}
                      onClick={() => {
                        if (!isEditMode) {
                          assignAction(props.header, item.id);
                        }
                      }}
                    >
                      <span
                        className={`${
                          item.id === selectedItemId ? "selectedItem" : ""
                        }`}
                      >
                        {item.text}
                      </span>
                      {!isEditMode && item.id === selectedItemId && (
                        <img src={Check} alt="Check" style={Style.icon} />
                      )}
                      {isEditMode &&
                        hoveredItem === item.text.replace(/ +(?= )/g, "") && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAction(item.id);
                            }}
                          >
                            <img src={Trash} alt="Trash" style={Style.icon} />
                          </div>
                        )}
                    </Dropdown.Item>
                  );
            })}

          {!!!props.noedit &&
            props.predefinedScaleTypes === undefined &&
            props.header !== "Factor" &&
            !isEditMode &&
            search.length > 1 &&
            (props.header !== "Company" ||
              (props.header === "Company" &&
                !items.find(
                  (x: any) => x.name?.toLowerCase() === search?.toLowerCase()
                ))) && (
              <div
                style={Style.chip}
                onClick={() => {
                  addAction(props.header, search);
                }}
              >
                <img src={Plus} alt="Plus" style={Style.iconPlus} />
                Create {props.header} {search}
              </div>
            )}

          {isEditMode && (
            <Button
              className="btn-review"
              style={Style.done}
              onClick={() => setIsEditMode(false)}
            >
              Done
            </Button>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {props.predefinedScaleTypes &&
        props.predefinedScaleTypes.length > 0 &&
        selectedItemId === "" && <div style={Style.required}>Required *</div>}
    </main>
  );
}

const Style = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as "column",
    flex: 1,
  },
  label: {
    color: "var(--gunmetal)",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.14,
    fontFamily: "proxima-nova, sans-serif",
    marginBottom: 10,
  },
  boxheaderLabel: {
    fontSize: 14,
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 0,
  },
  search: {
    width: "100%",
    height: 32,
    backgroundColor: "var(--pale-grey)",
    borderWidth: 0,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    marginBottom: 7,
    marginTop: 7,
  },
  icon: {
    height: 16,
    width: 16,
    cursor: "pointer",
  },
  unselectedDropBoxLabel: {
    color: "var(--grey)",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily: "proxima-nova, sans-serif",
  },
  chip: {
    backgroundColor: "var(--blue-dark)",
    width: "fit-content",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    color: "var(--white)",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    fontFamily: "proxima-nova, sans-serif",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
    cursor: "pointer",
    wordBreak: "break-all" as "break-all",
    whiteSpace: "normal" as "normal",
  },
  iconPlus: {
    height: 12,
    width: 12,
    marginRight: 4,
  },
  tag: {
    backgroundColor: "var(--pale-grey)",
    width: "fit-content",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    color: "var(--blue-dark)",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.14,
    fontFamily: "proxima-nova, sans-serif",
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
    cursor: "pointer",
  },
  iconDelete: {
    height: 10,
    width: 10,
    marginLeft: 8,
  },
  tagWrapper: {
    display: "flex",
  },
  done: {
    marginTop: 55,
    justifyContent: "center",
    color: "var(--white)",
    height: 32,
    marginLeft: 16,
    marginRight: 16,
    fontSize: 16,
    width: "-webkit-fill-available",
  },
  required: {
    fontSize: 12,
    fontFamily: "proxima-nova, sans-serif",
    color: "#f74f10",
    paddingLeft: 16,
  },
};

export default DropBox;
