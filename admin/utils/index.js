export function toImagesSrc(src){
    if(src){
        return `http://www.nykarlebyvyer.nu/${src.replace('../../../', '')}`;
    }

    return '';
}