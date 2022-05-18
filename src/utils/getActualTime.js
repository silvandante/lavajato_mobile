import { isNullOrEmpty } from "./isNullOrEmpty"

export function getActualTime(item) {
    var result
    if(!isNullOrEmpty(item.acceptedDate)) {
        result = item.acceptedDate
    } else {
        if(!isNullOrEmpty(item.suggestedDate)) {
            result = item.suggestedDate
        } else {
            result = item.originalDate
        }
    }
    return result
}