const OverviewCard = ({title,value,growth,icon}) => {
    return (
        <div className="card">
            <div className="card-header">
                <div className="card-meta">
                    <h3 className="card-title">{title}</h3>
                    <p className="card-value">{value}</p>
                </div>
                <div className="card-icon"><i className={icon}></i></div>
            </div>
        </div>
    )
}

export default OverviewCard