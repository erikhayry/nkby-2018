function getLaballedMarker({position}, label){
    return `&markers=color:gray|label:${label + 1}|${position.lat},${position.lng}`
}

export default (props) => {
    const {currentLocale = {}, localesNearby = []} = props;
    const { position } = currentLocale;

    let markers = position ? `&markers=${position.lat},${position.lng}` : '';
    markers = localesNearby.map(getLaballedMarker).join('') + markers;

    const center = position ? `${position.lat},${position.lng}` : `63.5217687,22.5216011`;
    const zoom = position ? 16 : 12;
    return (
        <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=400x400${markers}&key=${process.env.GOOGLE_STATIC_MAPS_API}`
            }
        />
    )
}