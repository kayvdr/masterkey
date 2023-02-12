package common

func Append(record []string, value *string) []string {
	if value != nil {
		record = append(record, *value)
	} else {
		record = append(record, "")
	}

	return record
}

func Contains(array []string, value string) bool {
	for _, item := range array {
		if item == value {
			return true
		}
	}
	return false
}
