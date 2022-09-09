import { HandlerFunction } from "@/bff/route";

/*
Jot form response
{"submission_id":"5385606161011301029","formID":"222474866607061","ip":"177.45.150.101","nome[first]":"Digital","nome[last]":"ME","cpf":"464365436","email":"oliver@digital-independence.dev","datade[day]":"23","datade[month]":"11","datade[year]":"1976","localde":"Hanover","profissao":"Cozinheiro","endereco[addr_line1]":"Rua Ariovaldo Marini, 105","endereco[addr_line2]":"","endereco[city]":"Valinhos","endereco[state]":"SP","endereco[postal]":"13279-172","endereco[country]":"Brazil","tipode":"CNH","comprovantede[0]":"unknown (4).png","enviararquivos[0]":"My mockup 2 from Urban Store Sign Mockups.jpg"}
 */

export const registerCustomer: HandlerFunction = async (req, res) => {
  // Echoing data!
  res.status(200).json(req.body);
};
