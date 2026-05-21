package engine

import "testing"

func newTestMeta() *Meta {
	return &Meta{
		Heroes: map[string]Hero{
			"1": {Name: "Anti-Mage", PrimaryAttr: "agi"},
			"2": {Name: "Axe", PrimaryAttr: "str"},
			"3": {Name: "Bane", PrimaryAttr: "int"},
			"4": {Name: "Lonely", PrimaryAttr: "agi"},
		},
		Advantages: map[string]map[string]float64{
			"1": {"2": 0.10, "3": -0.05},
			"2": {"1": -0.10, "3": 0.02},
			"3": {"1": 0.05, "2": -0.02},
		},
	}
}

func TestSuggestSumsAdvantagesAcrossEnemies(t *testing.T) {
	m := newTestMeta()

	got := m.Suggest([]string{"2", "3"})

	var hero1 Suggestion
	for _, s := range got {
		if s.HeroID == "1" {
			hero1 = s
			break
		}
	}

	want := 0.10 + -0.05
	if hero1.Score != want {
		t.Errorf("hero 1 score = %.4f, want %.4f", hero1.Score, want)
	}
}

func TestSuggestExcludesEnemiesFromCandidates(t *testing.T) {
	m := newTestMeta()

	got := m.Suggest([]string{"2", "3"})

	for _, s := range got {
		if s.HeroID == "2" || s.HeroID == "3" {
			t.Errorf("enemy %s should not appear in suggestions", s.HeroID)
		}
	}
}

func TestSuggestIsSortedDescending(t *testing.T) {
	m := newTestMeta()

	got := m.Suggest([]string{"2"})

	for i := 1; i < len(got); i++ {
		if got[i-1].Score < got[i].Score {
			t.Errorf("suggestions not sorted descending: [%d]=%.4f, [%d]=%.4f",
				i-1, got[i-1].Score, i, got[i].Score)
		}
	}
}

func TestSuggestMissingAdvantagesCountAsZero(t *testing.T) {
	m := newTestMeta()

	got := m.Suggest([]string{"2"})

	var lonely Suggestion
	for _, s := range got {
		if s.HeroID == "4" {
			lonely = s
			break
		}
	}
	if lonely.HeroID == "" {
		t.Fatal("Lonely (id=4) missing from suggestions")
	}
	if lonely.Score != 0 {
		t.Errorf("Lonely has no matchup data; score = %.4f, want 0", lonely.Score)
	}
}

func TestFindHeroByID(t *testing.T) {
	m := newTestMeta()

	id, err := m.FindHero("1")
	if err != nil {
		t.Fatalf("FindHero(\"1\"): %v", err)
	}
	if id != "1" {
		t.Errorf("FindHero(\"1\") = %q, want \"1\"", id)
	}
}

func TestFindHeroByNameVariants(t *testing.T) {
	m := newTestMeta()

	cases := []string{"Anti-Mage", "anti-mage", "antimage", "ANTI MAGE", "Anti Mage"}
	for _, q := range cases {
		id, err := m.FindHero(q)
		if err != nil {
			t.Errorf("FindHero(%q): unexpected error %v", q, err)
			continue
		}
		if id != "1" {
			t.Errorf("FindHero(%q) = %q, want \"1\"", q, id)
		}
	}
}

func TestFindHeroUnknown(t *testing.T) {
	m := newTestMeta()

	if _, err := m.FindHero("does-not-exist"); err == nil {
		t.Error("FindHero with unknown name returned nil error")
	}
}
