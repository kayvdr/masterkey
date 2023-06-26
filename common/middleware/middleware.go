package middleware

import (
	"net/http"
)

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// token := r.Header.Get("Authorization")
		// if !verifyToken(token) {
		// 	w.WriteHeader(http.StatusForbidden)
		// 	return
		// }

		next.ServeHTTP(w, r)
	})
}

// func verifyToken(token string) bool {
// 	url := fmt.Sprintf("%s/auth/v1/user", os.Getenv("VITE_SUPABASE_URL"))
// 	req, err := http.NewRequest("GET", url, nil)
// 	if err != nil {
// 		fmt.Println("Error creating request:", err)
// 		return false
// 	}

// 	req.Header.Set("Authorization", token)
// 	req.Header.Set("apikey", os.Getenv("VITE_SUPABASE_KEY"))

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		fmt.Println("Error sending request:", err)
// 		return false
// 	}
// 	defer resp.Body.Close()

// 	if resp.StatusCode != http.StatusOK {
// 		fmt.Println("Invalid token")
// 		return false
// 	}

// 	var user User
// 	err = json.NewDecoder(resp.Body).Decode(&user)
// 	if err != nil {
// 		fmt.Println("Error decoding response:", err)
// 		return false
// 	}

// 	fmt.Println("Authenticated user:", user.Email)
// 	return true
// }