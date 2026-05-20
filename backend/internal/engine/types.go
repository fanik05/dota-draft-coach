package engine

type Hero struct {
	Name        string   `json:"name"`
	PrimaryAttr string   `json:"primary_attr"`
	Roles       []string `json:"roles"`
}

type Meta struct {
	Heros      map[string]Hero   `json:"heroes"`
	Advantages map[string]float64 `json:"advantages"`
}
