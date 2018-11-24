export default (props) => {
    const {currentLocale} = props;

    const markers= `${currentLocale.position.lat},${currentLocale.position.lng}`;
    const center = `${currentLocale.position.lat},${currentLocale.position.lng}`;
    const zoom = currentLocale ? 16 : 12;
    return (
        <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=400x400&&markers=${markers}&key=${process.env.GOOGLE_STATIC_MAPS_API}`
            }
        />
    )
}