import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';

// Images
import DropBoxArrow from '../assets/dropbox-arrow.svg';
import Pencil from '../assets/pencil.svg';
import Check from '../assets/menu-check.svg';
import Plus from '../assets/plus.svg';
import Trash from '../assets/trash.svg';


const findSelectedItem = (id: string, items: any) => {
    if (items && items.length) {
        const selectedItem = items.find((item: any) => item.id == id);
        if (!selectedItem) {
            return;
        }

        return selectedItem?.name;
    }
};

function UserRoleDropBox(props: any) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedItemId, setSelectedItemId] = React.useState(props.selectedItemID);
    const [search, setSearch] = React.useState('');
    const [items, setItems] = React.useState<any>([]);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [hoveredItem, setHoveredItem] = React.useState('');

    // Init
    React.useEffect(() => {
        const foundItem = props.userRolesArr.find((item: any) => item.id === props.selectedItemID);
        const itemID = foundItem ? props.selectedItemID : '';

        setSelectedItemId(itemID);
        setItems(props.userRolesArr);
    }, []);

    React.useEffect(() => {
        const foundItem = props.userRolesArr.find((item: any) => item.id === selectedItemId);
        const itemID = foundItem ? selectedItemId : '';

        setSelectedItemId(itemID);
        setItems(props.userRolesArr);
    }, [props.userRolesArr]);

    const addAction = async (userRoleName: any) => {
        const existingUserRole = props.userRolesArr.find((userRole: any) => userRole?.name?.toLowerCase() === userRoleName?.toLowerCase());
        if (!!existingUserRole) return;

        const item = await props.addAction(userRoleName);
        const itemObj = {
            id: item.id,
            name: item.name
        };

        setItems([...items, itemObj]);
        props.setUserRolesArr([...items, itemObj]);
        setSelectedItemId(item.id);
        setSearch('');
        assignAction(props.responseId, item.id);
    };

    const removeAction = async (itemId: string) => {
        const defaultItems = items;
        const filteredItemsList = items.filter((i: any) => i.id !== itemId);
        let cannotBeDeleted = false;

        await props.removeAction(itemId).then((response: any) => {
            if (response && response.status !== 204) {
                cannotBeDeleted = response.detail.includes('cannot be deleted');
            }
        }).catch((error: any) => console.error('error', error));

        if (cannotBeDeleted) {
            setItems(defaultItems);
            props.setShow(true);
            return;
        }

        props.setUserRolesArr([...filteredItemsList]);
    };

    const assignAction = (responseId: number, userRoleId: string) => {
        const isSelectedIdDifferent = userRoleId !== selectedItemId;
        if (responseId && userRoleId && isSelectedIdDifferent) {
            props.assignAction(responseId, userRoleId);
            setSelectedItemId(userRoleId);
        }
    };

    return <main style={{ ...Style.wrapper, ...Style.dropbox }}>
        <Dropdown onToggle={(isOpen, event) => {
            setSearch('');
            setHoveredItem('');
            setIsOpen(isOpen);
            const th = document.getElementById(props.id);
            if (th) {
                if (isOpen) {
                    th.style.zIndex = '5';
                } else {
                    th.style.zIndex = '1';
                }

            }

        }} drop="down" >
            <Dropdown.Toggle variant="success" style={{
                border: '',
                height: '',
                borderColor: ''
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1
                }}>
                    {selectedItemId && <div>{findSelectedItem(selectedItemId, items)}</div>}
                    {!selectedItemId && <div style={Style.unselectedDropBoxLabel}>Assign Role</div>}
                    <img src={DropBoxArrow} alt="DropBoxArrow" style={{ height: 24, width: 24, transform: isOpen ? 'rotate(180deg)' : '' }} />
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropBoxMenu">
                <div style={{ ...Style.label, ...Style.boxheaderLabel }}>
                    {
                        !isEditMode && <>
                            User Role
                            <img src={Pencil} alt="Pencil" style={Style.icon} onClick={() => setIsEditMode(true)} />
                        </>
                    }
                    {isEditMode && 'Manage User Role'}
                </div>

                {!isEditMode &&
                    <input
                        value={search}
                        type="text"
                        style={Style.search}
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                    />}

                {items && items.map((item: any, i: number) => {
                    return item && item?.name?.toLowerCase().includes(search?.toLowerCase()) &&
                        <Dropdown.Item as="button" key={`user-role-${item.name}-${i}`}
                            onMouseOver={(e: any) => {
                                if (e.target.outerText) {
                                    setHoveredItem(e.target.outerText);
                                }
                            }}

                            onClick={() => {
                                if (!isEditMode) {
                                    assignAction(props.responseId, item.id);
                                }
                            }}

                            style={{
                                color: ''
                            }}
                        >
                            <span className={`${item.id === selectedItemId ? 'selectedItem' : ''}`}>{item.name}</span>
                            {!isEditMode && item.id === selectedItemId && <img src={Check} alt="Check" style={Style.icon} />}

                            {
                                isEditMode && hoveredItem === item.name.replace(/ +(?= )/g, '') &&
                                <div
                                    onClick={(e) => {
                                        removeAction(item.id);
                                        e.stopPropagation();
                                    }}
                                >
                                    <img src={Trash} alt="Trash" style={Style.icon} />
                                </div>
                            }
                        </Dropdown.Item>
                })
                }

                {
                    !isEditMode 
                    && search.length > 1 
                    && !props.userRolesArr.find((userRole: any) => userRole?.name?.toLowerCase() === search?.toLowerCase())
                    &&
                    <div style={Style.chipWrapper}>
                        <div
                            style={Style.chip}
                            onClick={() => addAction(search)}>
                            <img src={Plus} alt="Plus" style={Style.iconPlus} />
                            Create User Role {search}
                        </div>
                    </div>
                }

                {
                    isEditMode &&
                    <Button
                        className="btn-review"
                        style={Style.done}
                        onClick={() => setIsEditMode(false)}
                    >
                        Done
                    </Button>
                }
            </Dropdown.Menu>
        </Dropdown>
    </main>
}

const Style = {
    dropbox: {
        marginRight: 32,
        border: 'none'
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        flex: 1
    },
    label: {
        color: 'var(--gunmetal)',
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.14,
        fontFamily: 'proxima-nova, sans-serif',
        marginBottom: 10
    },
    boxheaderLabel: {
        fontSize: 14,
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 0
    },
    unselectedDropBoxLabel: {
        color: 'var(--grey)',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.5,
        fontFamily: 'proxima-nova, sans-serif',
    },
    search: {
        width: '100%',
        height: 32,
        backgroundColor: 'var(--pale-grey)',
        borderWidth: 0,
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 8,
        marginBottom: 7,
        marginTop: 7

    },
    icon: {
        height: 16,
        width: 16,
        cursor: 'pointer'
    },
    iconPlus: {
        height: 12,
        width: 12,
        marginRight: 4
    },
    chipWrapper: {
        width: '100%',
        padding: '8px 16px'
    },
    chip: {
        backgroundColor: 'var(--blue-dark)',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
        color: 'var(--white)',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1,
        fontFamily: 'proxima-nova, sans-serif',
        borderRadius: 4,
        cursor: 'pointer',
        wordBreak: 'break-all' as 'break-all',
        whiteSpace: 'normal' as 'normal'
    },
    done: {
        marginTop: 55,
        justifyContent: 'center',
        color: 'var(--white)', height: 32, marginLeft: 16, marginRight: 16, fontSize: 16, width: '-webkit-fill-available'
    }
};

export default UserRoleDropBox;
