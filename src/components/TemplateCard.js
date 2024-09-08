import React from 'react'
import { Row, Col, Card } from 'reactstrap'

export default function TemplateCard({activities, selectedCard}) {

    const handleCardClick = (id) => {
        selectedCard(id)
    }
    
  return (
    <Row>
    {activities.map((i, index) => (
      <Col key={index} sm={12} md={6} lg={4}>
        <Card className="pick-template-card" onClick={()=> handleCardClick(i.id)}>
          <Row>
            <Col xs={4} sm={4} className="d-flex">
              <img src={i.image} className="img-fluid" />
            </Col>
            <Col
              xs={8}
              sm={8}
              className="d-flex flex-column justify-content-center align-items-start"
            >
              <div className="font-size-18 fw-bold">{i.title}</div>
              <div className="text-start font-size-13">{i.definition}</div>
            </Col>
          </Row>
        </Card>
      </Col>
    ))}
  </Row>
  )
}
