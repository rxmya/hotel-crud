export default function Popup({message, onClose}){
    if (message) return null;
    return (
        <div className = "overlay" onClick = {onClose}>
            <div className = "popup" onClick = {(e) => e.stopPropagation()}>
                <div className = "popup-icon">
                    <p>{message}</p>
                    <button className = "btn btn-primary" onClick = {onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}