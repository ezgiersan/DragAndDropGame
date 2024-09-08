import React, { useState } from "react";
import { Row, Col, Button, Form, Input, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCopy, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Matching = () => {
  const [items, setItems] = useState([
    { id: 1, keyword: "", definition: "" },
    { id: 2, keyword: "", definition: "" },
    { id: 3, keyword: "", definition: "" },
  ]);

  const [activityTitle, setActivityTitle] = useState("Deneme");
  const [showMinAlert, setShowMinAlert] = useState(false);
  const [showMaxAlert, setShowMaxAlert] = useState(false);
  const [removingIndex, setRemovingIndex] = useState(null);
  const [keywordErrors, setKeywordErrors] = useState(new Set());
  const [definitionErrors, setDefinitionErrors] = useState(new Set());
  const [keywordEmpty, setKeywordEmpty] = useState(new Set());
  const [definitionEmpty, setDefinitionEmpty] = useState(new Set());


  const navigate = useNavigate();

  const getNextId = () => {
    return Math.max(...items.map(item => item.id)) + 1;
  };

  const handleAddItem = () => {
    setItems([...items, { id: getNextId(), keyword: "", definition: "" }]);
  };

  const handleInputChange = (id, event) => {
    const { name, value } = event.target;
    const newItems = items.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setItems(newItems);

    // Hataları, butona tıklanıp tıklanmadığını kontrol ederek göster
    if (showMinAlert || showMaxAlert || keywordErrors.size > 0 || definitionErrors.size > 0) {
      validateItems(newItems);
    }
  };

  const handleDeleteItem = (id) => {
    setRemovingIndex(id);
    setTimeout(() => {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      setRemovingIndex(null);
      
    }, 500);
  };

  const handleCopyItem = (id) => {
    const itemToCopy = items.find((item) => item.id === id);
  
    if (!itemToCopy) {
      console.error("Öğe bulunamadı");
      return;
    }
  
    const newId = getNextId();
    const newItem = { ...itemToCopy, id: newId };
  
    // Kopyalanan öğeyi mevcut öğenin hemen altına ekle
    const newItems = items.reduce((acc, item) => {
      acc.push(item);
      if (item.id === id) {
        acc.push(newItem);
      }
      return acc;
    }, []);
  
    setItems(newItems);

  };

  const validateItems = (items) => {
    const keywordSet = new Set();
    const definitionSet = new Set();
    const keywordErrors = new Set();
    const definitionErrors = new Set();
    const keywordEmpty = new Set();
    const definitionEmpty = new Set();

    items.forEach((item) => {
      if (item.keyword.trim() === "") {
        keywordEmpty.add(item.id);
      } else if (keywordSet.has(item.keyword)) {
        keywordErrors.add(item.id);
      }
      if (item.definition.trim() === "") {
        definitionEmpty.add(item.id);
      } else if (definitionSet.has(item.definition)) {
        definitionErrors.add(item.id);
      }
      keywordSet.add(item.keyword);
      definitionSet.add(item.definition);
    });

    setKeywordErrors(keywordErrors);
    setDefinitionErrors(definitionErrors);
    setKeywordEmpty(keywordEmpty);
    setDefinitionEmpty(definitionEmpty);

    return keywordErrors.size === 0 && definitionErrors.size === 0 && keywordEmpty.size === 0 && definitionEmpty.size === 0;
  };

  const handleStartGame = () => {
    const isValid = validateItems(items);

    // Minimum ve maksimum öğe kontrolü
    if (items.length < 3) {
      setShowMinAlert(true);
      return;
    } else {
      setShowMinAlert(false);
    }

    if (items.length > 30) {
      setShowMaxAlert(true);
      return;
    } else {
      setShowMaxAlert(false);
    }

    // Her şey doğruysa sayfayı değiştir
    if (isValid) {
      navigate(`/matching/${activityTitle}`, { state: { items } });
    }
  };

  return (
    <div className="pick-template">
      <Form>
        <Row className="mb-3">
          <Col>
            <label>Etkinlik Başlığı</label>
            <Input
              type="text"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
            />
          </Col>

          <Col xs={12} className="mt-2">
            {showMinAlert && <Alert color="danger"> En az 3 öğe olmalıdır. </Alert>}
            {showMaxAlert && <Alert color="danger"> En fazla 30 öğe olmalıdır. </Alert>}
          </Col>
        </Row>

        <Row className="font-weight-bold">
          <Col xs={1}></Col>
          <Col className="input-title" xs={4}>Anahtar kelime</Col>
          <Col className="input-title" xs={4}>Eşleşen tanım</Col>
        </Row>

        {items.map((item) => (
          <Row
            key={item.id}
            className={`mb-3 align-items-center ${removingIndex === item.id ? "item-fade-out" : ""}`}
          >
            <Col xs={1}>{items.findIndex(i => i.id === item.id) + 1}.</Col>
            <Col xs={8} className="activity-input">
              <div className="w-100">
                <Input
                  type="text"
                  name="keyword"
                  value={item.keyword}
                  onChange={(e) => handleInputChange(item.id, e)}
                  style={{
                    border: keywordErrors.has(item.id) || keywordEmpty.has(item.id) ? "1.5px solid red" : "",
                  }}
                />
                {keywordErrors.has(item.id) && <span className="text-danger">Birbirinin aynı olan öğeleri içeremez!</span>}
                {keywordEmpty.has(item.id) && <span className="text-danger">Her iki sütun da birkaç metin içermeli!</span>}
              </div>
              <div className="w-100">
                <Input
                  type="text"
                  name="definition"
                  value={item.definition}
                  onChange={(e) => handleInputChange(item.id, e)}
                  style={{
                    border: definitionErrors.has(item.id) || definitionEmpty.has(item.id) ? "1.5px solid red" : "",
                  }}
                />
                {definitionErrors.has(item.id) && <span className="text-danger">Birbirinin aynı olan öğeleri içeremez!</span>}
                {definitionEmpty.has(item.id) && <span className="text-danger">Her iki sütun da birkaç metin içermeli!</span>}

              </div>
            </Col>
            <Col xs={1} className="d-flex align-items-center">
              <Button
                onClick={() => handleCopyItem(item.id)}
                className="me-1 icon-btn copy-btn"
              >
                <FontAwesomeIcon icon={faCopy} />
              </Button>
              <Button
                onClick={() => handleDeleteItem(item.id)}
                className="icon-btn"
                disabled={items.length === 1}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
          </Row>
        ))}

        <Row>
          <Col xs={12} className="p-0">
            <Button className="add-item-btn" onClick={handleAddItem}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faPlus} className="me-2 fw-600" />
                <p className="mb-0 text-start fw-600">Öğe ekle</p>
              </div>
              <span className="font-size-10 add-range">min 3 maks 30</span>
            </Button>
          </Col>

          <Col xs={12} className="p-0 d-flex justify-content-end">
            <Button
              className="btn-blue btn-large"
              onClick={handleStartGame}
            >
              Bitti
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Matching;
