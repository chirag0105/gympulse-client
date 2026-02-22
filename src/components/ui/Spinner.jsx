import './Spinner.css';
function Spinner({ size = 'md', fullPage = false, className = '' }) {
    if (fullPage) {
        return (
            <div className="spinner-overlay">
                <div className={`spinner spinner-${size} ${className}`} role="status" aria-label="Loading" />
            </div>
        );
    }
    return <div className={`spinner spinner-${size} ${className}`} role="status" aria-label="Loading" />;
}
export default Spinner;
