import React from "react";
import { Dropdown, Button } from "react-bootstrap";

// Images
import DropBoxArrow from "../assets/dropbox-arrow.svg";
import Pencil from "../assets/pencil.svg";
import Plus from "../assets/plus.svg";
import Delete from "../assets/delete.svg";
import Trash from "../assets/trash.svg";

function Tags(props: any) {
  return (
    <div style={Style.tagWrapper}>
      {props?.items?.filter((x: any, i: number) => props.mSelectedItem.includes(x.id))
        .map((e: any, i: number) => (
          <div style={Style.tag} key={e.id}>
            {e.name}
            <img
              src={Delete}
              alt="Delete"
              onClick={() => {
                if (props.updateOverviewIndustryIds) {
                  props.unAssignAction(props.surveyId, e.id,props?.responseId);
                  const removedList = props.mSelectedItem.filter(
                    (x: any, index: number) => x !== e.id
                  );
                  props.setMSelectedItem([...removedList]);
                  props.updateOverviewIndustryIds([...removedList]);
                } else if (props.updateOverviewprocessIds) {
                  props.unAssignAction(props.surveyId, e.id,props?.responseId);
                  const removedList = props.mSelectedItem.filter(
                    (x: any, index: number) => x !== e.id
                  );
                  props.setMSelectedItem([...removedList]);
                  props.updateOverviewprocessIds([...removedList]);
                }
              }}
              style={Style.iconDelete}
            />
          </div>
        ))}
    </div>
  );
}

function DropBoxMulti(props: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState("");
  const [mSelectedItem, setMSelectedItem] = React.useState<any>([]);
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState<any>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState("");

  // on loading find the matched selected item index
  React.useEffect(() => {
    props.onLoad &&
      !props.isfetchingSurvey &&
      props.onLoad().then((items: any) => {
        setItems(items);
        if (props.selectedItems && props.selectedItems.length > 0) {
          const matchIndexArr = items
            .filter(
              (it: any, i: number) =>
                props.selectedItems && props.selectedItems.includes(it.id)
            )
            .map((item: any) => item.id);
          setMSelectedItem([...matchIndexArr]);
        }
      });
  }, [props.isfetchingSurvey]);

  React.useEffect(() => {
    props.onLoad &&
      props.onLoad().then((items: any) => {
        setItems(items);

        if (props.selectedItems && props.selectedItems.length > 0) {
          const matchIndexArr = items
            .filter(
              (it: any, i: number) =>
                props.selectedItems && props.selectedItems.includes(it.id)
            )
            .map((item: any) => item.id);

          setMSelectedItem([...matchIndexArr]);
        }
      });
  }, [props.selectedItems]);

  React.useEffect(() => {
    if (props.header === "Project") {
      const foundItem = items?.find((item: any) => item.id === props.projectId);
      const itemID = foundItem ? props.projectId : "";
      setSelectedItemId(itemID);
    }
  }, [props.projectId, items]);

  const addAction = async (name: string) => {
    const item = await props.addAction(name);
    const itemObj = { id: item.id, name };
    props.assignAction(props.surveyId, [item.id],props?.responseId);
    props.header == "Industry" &&
      props.updateOverviewIndustryIds([...mSelectedItem, item.id]);
    props.header == "Process" &&
      props.updateOverviewprocessIds([...mSelectedItem, item.id]);

    setItems([...items, itemObj]);
    setMSelectedItem([...mSelectedItem, items.length]);
    setSearch("");
  };

  const removeAction = (itemId: string) => {
    const removedItemsList = items?.filter((i: any) => i.id !== itemId);
    setItems(removedItemsList);

    // remove
    props.removeAction(itemId);

    // if a selected item then reset selected item
    if (itemId === selectedItemId) {
      setSelectedItemId("");
    }
  };

  return (
    <main style={{ ...Style.wrapper, ...props.style }}>
      <div style={Style.label}>{props.header}</div>

      <Dropdown
        onToggle={(isOpen) => {
          setSearch("");
          setHoveredItem("");
          setIsOpen(isOpen);
        }}
      >
        <Dropdown.Toggle variant="success">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            {mSelectedItem.length !== 0 && (
              <div>
                {items?.filter((it: any) => mSelectedItem.includes(it.id))
                  .map((it: any) => it.name)
                  .join(", ")}
              </div>
            )}

            {mSelectedItem.length === 0 && (
              <div style={Style.unselectedDropBoxLabel}>Please Select</div>
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
          <div style={{ ...Style.label, ...Style.boxheaderLabel }}>
            {!isEditMode && (
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

          <form
            onSubmit={(e) => {
              addAction(search);
              e.preventDefault();
            }}
          >
            {!isEditMode && (
              <input
                value={search}
                type="text"
                style={Style.search}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
            {!isEditMode && search.length > 1 && (
              <div
                style={Style.chip}
                onClick={() => {
                  addAction(search);
                }}
              >
                <img src={Plus} alt="Plus" style={Style.iconPlus} />
                Create {search}
              </div>
            )}
          </form>

          {
            <Tags
              items={items}
              mSelectedItem={mSelectedItem}
              setMSelectedItem={setMSelectedItem}
              unAssignAction={props.unAssignAction}
              surveyId={props.surveyId}
              responseId={props?.responseId}
              updateOverviewIndustryIds={props.updateOverviewIndustryIds}
              updateOverviewprocessIds={props.updateOverviewprocessIds}
            />
          }

          {items
            .filter((x: any) => !mSelectedItem.includes(x.id))
            .filter((item: any) =>
              item.name?.toLowerCase().includes(search?.toLowerCase())
            )
            .map((item: any) => (
              <Dropdown.Item
                key={`${props.header}-${item.name}`}
                onMouseOver={(e: any) => {
                  if (e.target.outerText) {
                    setHoveredItem(e.target.outerText);
                  }
                }}
                onClick={() => {
                  props.assignAction(props.surveyId, [item.id],props?.responseId);
                  setMSelectedItem([...mSelectedItem, item.id]);
                  props.header == "Industry" &&
                    props.updateOverviewIndustryIds([
                      ...mSelectedItem,
                      item.id,
                    ]);
                  props.header == "Process" &&
                    props.updateOverviewprocessIds([...mSelectedItem, item.id]);
                }}
              >
                {item.name}
                {isEditMode && hoveredItem === item.name && (
                  <div
                    onClick={(e) => {
                      removeAction(item.id);
                      props.header == "Industry" &&
                        props.updateOverviewIndustryIds(item.id);
                      props.header == "Process" &&
                        props.updateOverviewprocessIds(item.id);
                      e.stopPropagation();
                    }}
                  >
                    <img src={Trash} alt="Trash" style={Style.icon} />
                  </div>
                )}
              </Dropdown.Item>
            ))}

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

      {!isOpen && (
        <Tags
          items={items}
          mSelectedItem={mSelectedItem}
          setMSelectedItem={setMSelectedItem}
          unAssignAction={props.unAssignAction}
          surveyId={props.surveyId}
          responseId={props?.responseId}
          updateOverviewIndustryIds={props.updateOverviewIndustryIds}
          updateOverviewprocessIds={props.updateOverviewprocessIds}
        />
      )}
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
};

export default DropBoxMulti;
