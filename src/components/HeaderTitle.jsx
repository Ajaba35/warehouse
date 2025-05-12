const HeaderTitle = ({title,display,onAddClick}) => {
    return (
        <div className="header-tile">
            <h2>{title}</h2>
            <div className="action-add" style={{ display: display }} onClick={onAddClick}><i className='bx bx-plus'></i></div>
        </div>
    )
}

export default HeaderTitle