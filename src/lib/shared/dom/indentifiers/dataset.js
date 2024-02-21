import { randomString } from "."
import { capitalizeFirstLetter, lowerCaseFirstLetter } from "../../regex/text";

export const generateRandomDatasetAttribute = function(){
    let leftUuid = randomString(7);
    let rightUuid = randomString(7);
    let uuid = leftUuid+'-'+rightUuid;
    let directive = 'data-'+uuid+'="true"'
    return {
        'directive': ' '+directive+' '.replaceAll("'",''),
        'uuid': uuid,
        'selector': `[${directive}]`,
        'path': lowerCaseFirstLetter(leftUuid)+capitalizeFirstLetter(rightUuid)
    }
}