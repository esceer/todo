package common

import "time"

type Identifier int

type DateTimeShort time.Time

func (d *DateTimeShort) UnmarshalJSON(bytes []byte) error {
	dd, err := time.Parse(`"2006-01-02T15:04"`, string(bytes))
	if err != nil {
		return err
	}
	*d = DateTimeShort(dd)
	return nil
}

func (d *DateTimeShort) MarshalJSON() ([]byte, error) {
	ds := time.Time(*d)
	return []byte(`"` + ds.Format("2006-01-02T15:04") + `"`), nil
}
