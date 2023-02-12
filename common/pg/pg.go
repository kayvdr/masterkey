package pg

func ILIKE(s string) string {
	if s == "" {
		return s
	}
	return "%" + s + "%"
}