package engine

type Hero struct {
	Name        string   `json:"name"`
	PrimaryAttr string   `json:"primary_attr"`
	Roles       []string `json:"roles"`
}

type Meta struct {
	Heroes     map[string]Hero               `json:"heroes"`
	Advantages map[string]map[string]float64 `json:"advantages"`
}
