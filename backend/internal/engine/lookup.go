package engine

import (
	"fmt"
	"strings"
)

// FindHero resolves a query (numeric ID or hero name) to a hero ID.
// Name matching is case- and punctuation-insensitive: "Anti-Mage",
// "anti-mage", "antimage", and "ANTI MAGE" all resolve to id "1".
func (m *Meta) FindHero(query string) (string, error) {
	if _, ok := m.Heroes[query]; ok {
		return query, nil
	}

	needle := normalizeName(query)
	if needle == "" {
		return "", fmt.Errorf("empty hero query")
	}

	for id, hero := range m.Heroes {
		if normalizeName(hero.Name) == needle {
			return id, nil
		}
	}
	return "", fmt.Errorf("no hero matching %q", query)
}

func normalizeName(s string) string {
	var b strings.Builder
	for _, r := range strings.ToLower(s) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		}
	}
	return b.String()
}
