package api

import (
	"encoding/json"
	"net/http"

	"github.com/fanik05/dota-draft-coach/internal/engine"
)

type Server struct {
	Meta *engine.Meta
}

func RegisterRoutes(mux *http.ServeMux, s *Server) {
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.HandleFunc("GET /heroes", s.handleHeroes)
	mux.HandleFunc("POST /suggest", s.handleSuggest)
}

func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	w.Write([]byte("ok"))
}

func (s *Server) handleHeroes(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, s.Meta.Heroes)
}

type suggestRequest struct {
	Enemies []string `json:"enemies"`
	Limit   int      `json:"limit,omitempty"`
}

type heroRef struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type suggestion struct {
	heroRef
	Score float64 `json:"score"`
}

type suggestResponse struct {
	Enemies     []heroRef    `json:"enemies"`
	Suggestions []suggestion `json:"suggestions"`
}

func (s *Server) handleSuggest(w http.ResponseWriter, r *http.Request) {
	var req suggestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}
	if len(req.Enemies) == 0 {
		http.Error(w, "enemies must not be empty", http.StatusBadRequest)
		return
	}

	limit := req.Limit
	if limit <= 0 {
		limit = 10
	}

	enemyIDs := make([]string, 0, len(req.Enemies))
	enemyRefs := make([]heroRef, 0, len(req.Enemies))
	for _, q := range req.Enemies {
		id, err := s.Meta.FindHero(q)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		enemyIDs = append(enemyIDs, id)
		enemyRefs = append(enemyRefs, heroRef{ID: id, Name: s.Meta.Heroes[id].Name})
	}

	ranked := s.Meta.Suggest(enemyIDs)
	if len(ranked) > limit {
		ranked = ranked[:limit]
	}

	items := make([]suggestion, 0, len(ranked))
	for _, sg := range ranked {
		items = append(items, suggestion{
			heroRef: heroRef{ID: sg.HeroID, Name: s.Meta.Heroes[sg.HeroID].Name},
			Score:   sg.Score,
		})
	}

	writeJSON(w, http.StatusOK, suggestResponse{Enemies: enemyRefs, Suggestions: items})
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}
