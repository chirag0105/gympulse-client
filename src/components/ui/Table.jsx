import './Table.css';
function Table({ children, striped = false, className = '' }) {
    return (
        <div className="table-wrapper">
            <table className={`table ${striped ? 'table-striped' : ''} ${className}`}>
                {children}
            </table>
        </div>
    );
}
export default Table;
