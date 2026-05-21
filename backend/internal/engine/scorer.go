package engine

import "slices"

type Suggestion struct {
	HeroID string
	Score  float64
}

func (m *Meta) Suggest(enemies []string) []Suggestion {
	enemySet := make(map[string]bool)

	for _, id := range enemies {
		enemySet[id] = true
	}

	var suggestions []Suggestion

	for candidateID := range m.Heroes {
		if enemySet[candidateID] {
			continue
		}

		var score float64
		candidateAdvantages := m.Advantages[candidateID]

		for _, enemyID := range enemies {
			score += candidateAdvantages[enemyID]
		}

		suggestions = append(suggestions, Suggestion{
			HeroID: candidateID,
			Score:  score,
		})
	}

	slices.SortFunc(suggestions, func(a, b Suggestion) int {
		if a.Score > b.Score {
			return -1
		}

		if a.Score < b.Score {
			return 1
		}

		return 0
	})

	return suggestions
}
